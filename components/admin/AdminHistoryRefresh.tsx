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
  const pendingDestination = useRef<string | null>(null);
  const [restoration, setRestoration] = useState(0);

  useEffect(() => {
    const restore = () => {
      pendingDestination.current = `${location.pathname}?${new URLSearchParams(location.search)}`;
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
