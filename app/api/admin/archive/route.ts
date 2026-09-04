import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, sessionValid } from "@/lib/admin-auth";
import { setEnquiryStatus } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  /* Checked here too, not only in the layout. The layout guards what is shown;
     this guards what is done, and an unauthenticated POST never reaches a
     layout. */
  if (!sessionValid(cookies().get(SESSION_COOKIE)?.value)) {
    return new NextResponse("forbidden", { status: 403 });
  }

  const form = await request.formData();
  const id = String(form.get("id") ?? "");
  if (id) await setEnquiryStatus(id, "archived");

  return NextResponse.redirect(new URL("/admin", new URL(request.url).origin), { status: 303 });
}
