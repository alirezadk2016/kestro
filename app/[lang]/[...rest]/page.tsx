import { notFound } from "next/navigation";

/*
 * The route that catches everything with no route of its own.
 *
 * Without it a URL like /en/pricing-2019 matched nothing, and "nothing" in
 * this app meant Next's built-in 404 — black on white, English only, no
 * header, no footer and no way back. A visitor arriving from a stale link or
 * a moved page had nowhere to go but the back button.
 *
 * It sits at the bottom of the routing order: every real page, static or
 * dynamic, is a more specific match and wins. All this does is reach the
 * language segment's not-found boundary, which renders inside the site's own
 * layout with the header and the footer attached.
 *
 * dynamicParams because the whole point is paths that were never enumerated.
 * The layout's own `dynamicParams = false` still stands, so /wp-login.php —
 * with a dot, which middleware leaves unprefixed — is still rejected at the
 * routing layer rather than rendered.
 */
export const dynamicParams = true;

export function generateStaticParams() {
  /* Nothing to pre-render: every path this matches is one that does not
     exist. It is listed so the segment is built rather than skipped. */
  return [];
}

export default function CatchAll() {
  notFound();
}
