"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Tells /api/track which page is being read.
 *
 * Keyed on the pathname rather than run once on mount: the site navigates
 * client-side, so a single call would count the page somebody entered on and
 * none of the ones they went on to read — which is the same bug the Google tag
 * has to work around, for the same reason.
 *
 * The ref guards React's development double-invocation and any re-render that
 * does not change the path, so one page is one count.
 *
 * No consent gate, and it needs none: it sends a path and nothing about the
 * person reading it. Nothing is stored in the browser, nothing identifies a
 * visitor, and two visits to the same page are indistinguishable from one
 * visitor reading it twice — which is the honest limit of what it measures.
 */
export default function PageViewTracker() {
  const pathname = usePathname();
  const counted = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || counted.current === pathname) return;
    counted.current = pathname;

    /* keepalive so the request survives the visitor leaving immediately —
       a bounce is exactly the view most worth not losing. */
    fetch("/api/track", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ path: pathname }),
      keepalive: true,
    }).catch(() => {
      /* Offline, blocked, or the database is down. A missed count is not
         something to tell the reader about. */
    });
  }, [pathname]);

  return null;
}
