/**
 * The same session cookie, checked where node:crypto does not exist.
 *
 * lib/admin-auth.ts is the definition of the scheme — `${expires}.${HMAC-SHA256
 * over expires}`, signed with ADMIN_SESSION_SECRET or, failing that, the
 * password. It is a Node module: it reads cookies() and it uses node:crypto, so
 * it cannot be imported by middleware, which runs on the edge runtime.
 *
 * Middleware is where the outermost gate has to live, because it is the only
 * thing that runs before the router decides which page or handler answers — and
 * the router is exactly what the RSC bypass talked to. So the check is written
 * a second time here against Web Crypto, which the edge runtime does have.
 *
 * Two implementations of one scheme can drift. scripts/security/attack.mjs
 * proves they agree: it signs a cookie with the Node path and verifies it with
 * this one, and signs a forged one and watches both refuse it.
 */

/**
 * The cookie's name, defined here rather than in lib/admin-auth.ts.
 *
 * Both runtimes need it and only one of them can import that file, so the name
 * lives in the module both can reach and admin-auth re-exports it. One string,
 * one place: a gate looking for the wrong cookie name is a gate that is not
 * there, and it would look exactly like one that is.
 */
export const SESSION_COOKIE_NAME = "kestro_admin";

/**
 * base64url, back to bytes.
 *
 * Node's base64url output drops the padding, and atob wants it: a 32-byte
 * signature encodes to 43 characters and atob will not decode a length that is
 * not a multiple of four.
 */
function fromBase64Url(value: string): ArrayBuffer | null {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) return null;
  const padded = value
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(value.length + ((4 - (value.length % 4)) % 4), "=");
  try {
    const binary = atob(padded);
    /* The buffer rather than the view: crypto.subtle wants a BufferSource whose
       backing store is an ArrayBuffer, and a bare Uint8Array is typed as one
       that might be shared. */
    const buffer = new ArrayBuffer(binary.length);
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    return buffer;
  } catch {
    return null;
  }
}

/**
 * Whether this cookie was signed with this secret and has not expired.
 *
 * The secret is passed in rather than read here. In the edge runtime a
 * `process.env.X` written at module scope can be inlined at build time, and a
 * gate that silently reads an empty string is a gate that either locks the
 * owner out or waves everybody through — neither decided by anything visible.
 * The caller reads it per request and says what it found.
 *
 * crypto.subtle.verify rather than re-signing and comparing strings: it is the
 * primitive that exists for this, and it does not hand a comparison over
 * secret-derived bytes to the JavaScript `===` operator.
 */
export async function sessionValidEdge(
  cookie: string | undefined,
  secret: string,
): Promise<boolean> {
  if (!secret || !cookie) return false;

  const cut = cookie.lastIndexOf(".");
  if (cut < 1) return false;

  const payload = cookie.slice(0, cut);
  const signature = fromBase64Url(cookie.slice(cut + 1));
  if (!signature) return false;

  const encoder = new TextEncoder();
  let key: CryptoKey;
  try {
    key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );
  } catch {
    return false;
  }

  const signed = await crypto.subtle.verify("HMAC", key, signature, encoder.encode(payload));
  if (!signed) return false;

  /* Only now is the expiry a number we wrote rather than one the visitor chose. */
  const expires = Number(payload);
  return Number.isFinite(expires) && expires > Date.now();
}
