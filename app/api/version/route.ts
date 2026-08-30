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
 * environment, so one request answers it exactly. No secrets: a commit SHA and
 * a branch name are already public in the repository.
 */
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    {
      commit: process.env.VERCEL_GIT_COMMIT_SHA ?? "unknown",
      branch: process.env.VERCEL_GIT_COMMIT_REF ?? "unknown",
      message: process.env.VERCEL_GIT_COMMIT_MESSAGE ?? "unknown",
      environment: process.env.VERCEL_ENV ?? "local",
      builtAt: process.env.VERCEL_DEPLOYMENT_ID ? undefined : "local build",
    },
    { headers: { "cache-control": "no-store" } },
  );
}
