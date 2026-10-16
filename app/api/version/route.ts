import { NextResponse } from "next/server";

/**
 * Which build is actually live.
 *
 * "Is the fix deployed?" was answered by reading the page and guessing from
 * its content — which is slow, ambiguous, and was wrong at least once: the
 * production domain was serving a build from weeks earlier while every push
 * produced a preview deployment nobody was looking at.
 *
 * Vercel injects the commit and branch of the running deployment into the
 * environment, so one request answers it exactly.
 *
 * The commit MESSAGE used to be in here too, on the reasoning that it is
 * "already public in the repository". It is not: this repository is private,
 * so the message was readable by anyone who called this address and by nobody
 * else — and a commit message is where the next thing being built, the name of
 * a service being integrated, or the bug just fixed tends to be written down.
 * The SHA answers "is the fix deployed?" on its own; the message only ever
 * answered "what else are they working on".
 */
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    {
      commit: process.env.VERCEL_GIT_COMMIT_SHA ?? "unknown",
      branch: process.env.VERCEL_GIT_COMMIT_REF ?? "unknown",
      environment: process.env.VERCEL_ENV ?? "local",
      builtAt: process.env.VERCEL_DEPLOYMENT_ID ? undefined : "local build",
    },
    { headers: { "cache-control": "no-store" } },
  );
}
