import NotFoundPanel from "@/components/NotFoundPanel";

/*
 * The 404 for anything that gets as far as a language segment — a page under
 * /da or /en calling notFound(). It renders inside this segment's layout, so
 * it arrives with the header, the footer and the site's own surface.
 *
 * A URL that never matches a route at all does not reach here; it is caught by
 * app/not-found.tsx, which has to carry its own document. Both draw the same
 * panel so the two cannot drift apart.
 */
export default function NotFound() {
  return <NotFoundPanel />;
}
