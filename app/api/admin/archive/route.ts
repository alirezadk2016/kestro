import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, sessionValid } from "@/lib/admin-auth";
import { setEnquiryStatus } from "@/lib/db";
import { seeOther } from "@/lib/redirect";
import { crossSitePost } from "@/lib/same-site";
import { adminForm, enquiryIdValid } from "@/lib/admin-form";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (crossSitePost(request)) {
    return new NextResponse("forbidden", { status: 403 });
  }

  /* Checked here too, not only in the layout. The layout guards what is shown;
     this guards what is done, and an unauthenticated POST never reaches a
     layout. */
  if (!sessionValid((await cookies()).get(SESSION_COOKIE)?.value)) {
    return new NextResponse("forbidden", { status: 403 });
  }

  const form = await adminForm(request);
  if (!form) return new NextResponse("invalid form", { status: 400 });
  const id = form.get("id");
  if (!enquiryIdValid(id)) return new NextResponse("invalid id", { status: 422 });
  if (!(await setEnquiryStatus(id, "archived"))) {
    return seeOther(`/admin/beskeder/${id}?handling=fejl`);
  }

  /* Back to the inbox rather than the dashboard: archiving happens while
     working through messages, and the next thing wanted is the next message. */
  return seeOther("/admin/beskeder?result=archived");
}
