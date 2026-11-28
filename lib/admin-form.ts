/** Only our generated enquiry identifiers may be used in redirect paths. */
export const enquiryIdValid = (id: unknown): id is string =>
  typeof id === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

export async function adminForm(request: Request): Promise<FormData | null> {
  const contentType = request.headers.get("content-type") || "";
  if (!/^(application\/x-www-form-urlencoded|multipart\/form-data)(;|$)/i.test(contentType))
    return null;
  try {
    return await request.formData();
  } catch {
    return null;
  }
}
