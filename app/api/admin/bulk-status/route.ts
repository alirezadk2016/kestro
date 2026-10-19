import { NextResponse } from "next/server";
import { adminAuthed } from "@/lib/admin-auth";
import { adminForm } from "@/lib/admin-form";
import { bulkEnquiryIds } from "@/lib/admin-follow-up";
import { bulkSetEnquiryStatus } from "@/lib/db";
import { seeOther } from "@/lib/redirect";
import { crossSitePost } from "@/lib/same-site";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await adminAuthed())) return new NextResponse("forbidden", { status: 403 });
  if (crossSitePost(request)) return new NextResponse("forbidden", { status: 403 });
  const form = await adminForm(request);
  if (!form) return new NextResponse("invalid form", { status: 400 });
  const ids = bulkEnquiryIds(form.getAll("ids"));
  const status = form.get("status");
  if (!ids || (status !== "new" && status !== "read" && status !== "archived"))
    return new NextResponse("invalid bulk action", { status: 422 });
  // Reconstruct a known local destination. Never accept a return URL or expose
  // the selected UUIDs in the redirect address.
  const query = new URLSearchParams();
  const filter = form.get("statusFilter");
  if (typeof filter === "string" && ["new", "read", "replied", "archived", "all"].includes(filter))
    query.set("status", filter);
  const q = form.get("q");
  if (typeof q === "string" && q.trim()) query.set("q", q.trim().slice(0, 120));
  const source = form.get("source");
  if (typeof source === "string" && ["contact", "quote", "instagram"].includes(source))
    query.set("source", source);
  if (form.get("sort") === "oldest") query.set("sort", "oldest");
  const result = await bulkSetEnquiryStatus(ids, status);
  if (result.available) {
    query.set("result", "bulk");
    query.set("changed", String(result.changed));
  } else query.set("bulk", "error");
  return seeOther(`/admin/beskeder?${query}`);
}
