"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/** History can restore a Router Cache snapshot from before a saved action.
 * Reconcile only after Next has restored the actual Back/Forward destination,
 * including history between two search states of the same admin page. */
export default function AdminHistoryRefresh() {
  const router = useRouter();
  const pathname = usePathname();
  const query = useSearchParams().toString();
  const rendered = useRef(`${pathname}?${query}`);
  const pendingDestination = useRef<string | null>(null);
  const [restoration, setRestoration] = useState(0);

  useEffect(() => {
    rendered.current = `${pathname}?${query}`;
  }, [pathname, query]);

  useEffect(() => {
    const restore = () => {
      const destination = `${location.pathname}?${new URLSearchParams(location.search)}`;
      /* An in-page anchor (the skip link, "#admin-main") is a fragment
         navigation, and Chrome fires popstate for it too. The page it lands on
         is the one already rendered, so nothing came out of the Router Cache;
         refreshing here refetched the whole workspace from the server on every
         press of "Gå til indhold". */
      if (destination === rendered.current) return;
      pendingDestination.current = destination;
      setRestoration((value) => value + 1);
    };
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, []);

  useEffect(() => {
    if (pendingDestination.current !== `${pathname}?${query}`) return;
    pendingDestination.current = null;
    if (pathname === "/admin" || pathname.startsWith("/admin/")) router.refresh();
  }, [pathname, query, restoration, router]);

  return null;
}
