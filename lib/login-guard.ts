/*
 * The login's second lock, which does not need a database.
 *
 * lib/db.ts counts failed passwords per address and locks the address for
 * fifteen minutes after five — in Postgres, so the count survives a cold
 * start and is shared by every instance. But every one of those functions
 * begins `if (!sql) return`, which is right for a deployment that has no
 * database and wrong for the one thing on this site worth attacking: with no
 * DATABASE_URL, adminLockedOut() is always false and the panel can be worked
 * through a wordlist as fast as the network allows.
 *
 * So there is a floor under it, held in memory. Per instance, and emptied on a
 * cold start, which is why it is the second lock rather than the first — but a
 * serverless instance that is being hammered is by definition a warm one, and
 * that is exactly when this counts.
 *
 * And every wrong answer costs the caller time. 400 ms is nothing to the one
 * person who mistyped and a fifteen-fold slowdown to a script that expected
 * 30 ms round trips; it applies whether or not there is a database.
 */

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILS = 5;
const FAIL_DELAY_MS = 400;

const fails = new Map<string, number[]>();

function recent(ip: string, now: number): number[] {
  const kept = (fails.get(ip) ?? []).filter((at) => now - at < WINDOW_MS);
  if (kept.length) fails.set(ip, kept);
  else fails.delete(ip);
  return kept;
}

/** True when this address has used its guesses for the window. */
export function lockedInMemory(ip: string, now = Date.now()): boolean {
  return recent(ip, now).length >= MAX_FAILS;
}

/** Count a wrong password against the address, then make the caller wait. */
export async function noteFailureInMemory(ip: string, now = Date.now()): Promise<void> {
  const kept = recent(ip, now);
  kept.push(now);
  fails.set(ip, kept);
  /* Bounded, so a caller rotating addresses cannot grow the map without
     limit: past 2000 entries, anything whose window has closed goes. */
  if (fails.size > 2000) for (const key of [...fails.keys()]) recent(key, now);
  await new Promise((resolve) => setTimeout(resolve, FAIL_DELAY_MS));
}

/** A correct password clears the address, the same as the database does. */
export function clearInMemory(ip: string): void {
  fails.delete(ip);
}
