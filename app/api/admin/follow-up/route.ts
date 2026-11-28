import { NextResponse } from "next/server";
import { adminAuthed } from "@/lib/admin-auth";
import { adminForm, enquiryIdValid } from "@/lib/admin-form";
import { followUpDateValid } from "@/lib/admin-follow-up";
import { updateEnquiryFollowUp } from "@/lib/db";
import { seeOther } from "@/lib/redirect";
import { crossSitePost } from "@/lib/same-site";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await adminAuthed())) return new NextResponse("forbidden", { status: 403 });
  if (crossSitePost(request)) return new NextResponse("forbidden", { status: 403 });
  const form = await adminForm(request);
  if (!form) return new NextResponse("invalid form", { status: 400 });
  const id = form.get("id");
  const priority = form.get("priority");
  const date = form.get("follow_up_on");
  if (
    !enquiryIdValid(id) ||
    (priority !== "normal" && priority !== "high") ||
    typeof date !== "string" ||
    (date !== "" && !followUpDateValid(date))
  )
    return new NextResponse("invalid follow-up", { status: 422 });
  const saved = await updateEnquiryFollowUp(id, { priority, followUpOn: date || null });
  return seeOther(`/admin/beskeder/${id}?followup=${saved ? "saved" : "error"}`);
}
