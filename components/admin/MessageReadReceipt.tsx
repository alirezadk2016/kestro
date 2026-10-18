"use client";

import { useEffect } from "react";
import { useInboxCount } from "@/components/admin/InboxCount";

/** Apply the count read after a confirmed transition, even when the surrounding
 * layout was retained by client navigation. Already-read views do no extra read. */
export default function MessageReadReceipt({ unread }: { unread: number | undefined }) {
  const { setCount } = useInboxCount();

  useEffect(() => {
    if (unread !== undefined) setCount(unread);
  }, [unread, setCount]);

  return null;
}
