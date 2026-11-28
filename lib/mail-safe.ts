/*
 * The three rules for putting something a stranger typed into a mail header.
 *
 * Shared by the contact form, which writes the enquiry, and the panel's
 * reply, which sends to the address the enquiry stored — so an address that
 * got in before a rule was tightened is checked again on the way out rather
 * than trusted because it is in our own database.
 */

/**
 * Loose about what a real address may contain, strict about the characters
 * that are syntax in an address header: `< > , ;` and a double quote are how
 * one header value becomes two addresses.
 */
export function looksLikeEmail(value: string): boolean {
  return /^[^\s@<>",;]+@[^\s@<>",;]+\.[^\s@<>",;]+$/.test(value);
}

/** A display name that can only ever label the one address after it. */
export function displayName(value: string): string {
  return `"${value.replace(/["\\<>\r\n]/g, "").trim()}"`;
}

/** A header is one line; a newline in one is how a sender adds headers. */
export function oneLine(value: string): string {
  return value.replace(/[\r\n\u2028\u2029]+/g, " ");
}
