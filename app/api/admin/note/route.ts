import { NextResponse } from "next/server";
import { adminAuthed } from "@/lib/admin-auth";
import { adminForm, enquiryIdValid } from "@/lib/admin-form";
import { updateEnquiryNote } from "@/lib/db";
import { crossSitePost } from "@/lib/same-site";
import { seeOther } from "@/lib/redirect";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await adminAuthed())) return new NextResponse("forbidden", { status: 403 });
  if (crossSitePost(request)) return new NextResponse("forbidden", { status: 403 });
  const form = await adminForm(request);
  if (!form) return new NextResponse("invalid form", { status: 400 });
  const id = form.get("id");
  const note = form.get("note");
  if (!enquiryIdValid(id) || typeof note !== "string" || note.length > 5000)
    return new NextResponse("invalid note", { status: 422 });
  const saved = await updateEnquiryNote(id, note.trim());
  return seeOther(`/admin/beskeder/${id}?note=${saved ? "saved" : "error"}`);
}
