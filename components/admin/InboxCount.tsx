"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

const InboxCountContext = createContext<{
  count: number;
  setCount: Dispatch<SetStateAction<number>>;
} | null>(null);

/** A page can report a confirmed read while Next keeps the navigation layout. */
export function InboxCountProvider({
  initialCount,
  children,
}: {
  initialCount: number;
  children: ReactNode;
}) {
  const [count, setCount] = useState(initialCount);
  const previousInitial = useRef(initialCount);

  useEffect(() => {
    // Do not overwrite a child receipt with the layout's older mount snapshot.
    // Later, changed server snapshots still synchronise the shared count.
    if (previousInitial.current === initialCount) return;
    previousInitial.current = initialCount;
    setCount(initialCount);
  }, [initialCount]);

  const value = useMemo(() => ({ count, setCount }), [count]);
  return <InboxCountContext.Provider value={value}>{children}</InboxCountContext.Provider>;
}

export function useInboxCount() {
  const context = useContext(InboxCountContext);
  if (!context) throw new Error("Inbox count requires the authenticated admin shell");
  return context;
}
