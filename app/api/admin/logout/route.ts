import { SESSION_COOKIE } from "@/lib/admin-auth";
import { seeOther } from "@/lib/redirect";

export const runtime = "nodejs";

export async function POST() {
  const response = seeOther("/admin");
  /* Expire rather than delete, so a browser that ignores one honours the other. */
  response.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}
