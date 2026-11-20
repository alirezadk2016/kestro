import { NextResponse } from "next/server";
import { adminAuthed } from "@/lib/admin-auth";
import { adminForm, enquiryIdValid } from "@/lib/admin-form";
import { setEnquiryStatus } from "@/lib/db";
import { crossSitePost } from "@/lib/same-site";
import { seeOther } from "@/lib/redirect";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await adminAuthed())) return new NextResponse("forbidden", { status: 403 });
  if (crossSitePost(request)) return new NextResponse("forbidden", { status: 403 });
  const form = await adminForm(request);
  if (!form) return new NextResponse("invalid form", { status: 400 });
  const id = form.get("id");
  const status = form.get("status");
  if (!enquiryIdValid(id) || (status !== "read" && status !== "new"))
    return new NextResponse("invalid status", { status: 422 });
  if (!(await setEnquiryStatus(id, status))) return seeOther(`/admin/beskeder/${id}?handling=fejl`);
  // Opening the detail marks new messages as read. Stay in the queue after
  // marking unread so the redirect does not immediately undo the operation.
  return status === "new"
    ? seeOther("/admin/beskeder?status=new&result=unread")
    : seeOther(`/admin/beskeder/${id}?result=restored`);
}
