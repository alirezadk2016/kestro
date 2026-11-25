/*
 * The same 404 as app/global-not-found.tsx, for the one case that file does
 * not reach: an unknown slug under a Danish section (/produkter/<typo>),
 * which middleware rewrites to /da/... and Next then renders dynamically
 * instead of serving the prerendered document. Without a root not-found that
 * case fell back to Next's own unstyled "404: This page could not be found."
 * in English. Every other unknown address gets the global document.
 */
export { default, metadata } from "./global-not-found";
