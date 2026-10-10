"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/** A minute between heartbeats: fine enough to measure a read, coarse enough
    that an open tab costs a handful of requests an hour. */
const HEARTBEAT_MS = 60_000;

const send = (body: Record<string, unknown>) =>
  fetch("/api/track", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    /* keepalive so the request survives the visitor leaving immediately — a
       bounce is exactly the view most worth not losing. */
    keepalive: true,
  }).catch(() => {
    /* Offline, blocked, or the database is asleep. A missed count is not
       something to tell the reader about. */
  });

/**
 * Tells /api/track which page is being read, and that it still is.
 *
 * Keyed on the pathname rather than run once on mount: the site navigates
 * client-side, so a single call would count the page somebody entered on and
 * none of the ones they went on to read — the same bug the Google tag has to
 * work around, for the same reason.
 *
 * The heartbeat is what turns a list of page loads into a length of stay.
 * Without it, somebody who opens one page and reads it carefully for six
 * minutes is indistinguishable from somebody who bounced in a second, and
 * "time on site" measures how fast people click rather than how long they
 * stay. It is sent only while the tab is actually visible, so a page left
 * open in a background tab overnight does not report a nine-hour visit.
 *
 * No consent gate, and it needs none: nothing is stored in the browser and
 * nothing identifies a person. The visitor is told apart on the server by a
 * hash that is discarded with the day's salt — see lib/visits.ts.
 */
export default function PageViewTracker() {
  const pathname = usePathname();
  const counted = useRef<string | null>(null);

  useEffect(() => {
    /* The ref guards React's development double-invocation and any re-render
       that does not change the path, so one page is one signal. A reload is
       counted at most once here and folded into the open visit on the server,
       which is where pressing refresh stops adding to the total. */
    if (!pathname || counted.current === pathname) return;
    counted.current = pathname;

    send({
      path: pathname,
      referrer: document.referrer,
      search: window.location.search,
    });
  }, [pathname]);

  useEffect(() => {
    const beat = () => {
      if (document.visibilityState === "visible") send({ ping: true });
    };
    const timer = window.setInterval(beat, HEARTBEAT_MS);
    /* Coming back to the tab is itself a sign of life, and it means a visit
       that resumes after a pause is extended rather than counted as a new one
       when the next heartbeat lands. */
    document.addEventListener("visibilitychange", beat);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", beat);
    };
  }, []);

  return null;
}
