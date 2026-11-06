/** Synthetic enquiries only; no server, database, mail or network is used. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import ts from "typescript";

const root = fileURLToPath(new URL("../../", import.meta.url));

function loadTypeScript(relative, imports = {}) {
  const source = readFileSync(join(root, relative), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const module = { exports: {} };
  const context = vm.createContext({
    module,
    exports: module.exports,
    require(name) {
      if (name in imports) return imports[name];
      if (name.startsWith("@/")) return loadTypeScript(name.slice(2) + ".ts", imports);
      if (name.startsWith("."))
        return loadTypeScript(join(dirname(relative), name).replaceAll("\\", "/") + ".ts", imports);
      throw new Error(`Contact checks rejected unexpected dependency: ${name}`);
    },
    Date,
    Map,
    URL,
    TextEncoder,
    Request,
    Response,
    process: { env: { NODE_ENV: "production" } },
    crypto: { randomUUID: () => "00000000-0000-4000-8000-000000000001" },
    fetch: () => {
      throw new Error("Contact checks forbid network access");
    },
    console: { error() {} },
  });
  new vm.Script(compiled, { filename: relative }).runInContext(context);
  return module.exports;
}

export async function verifyContactData() {
  const contact = loadTypeScript("lib/contact.ts");
  const sample = (change = {}) => ({
    name: "Synthetic visitor",
    company: "",
    email: "synthetic@example.invalid",
    phone: "",
    message: "Synthetic enquiry ending in a complete final sentence.",
    subject: "Enquiry",
    page: "/en/contact",
    kind: "contact",
    ...change,
  });
  let checked = 0;
  const check = async (name, run) => {
    try {
      await run();
      checked++;
    } catch (error) {
      throw new Error(`contact data: ${name}: ${error.message}`, { cause: error });
    }
  };
  await check("private contact enquiries do not need a company", () => {
    const result = contact.validateContactPayload(sample());
    assert.equal(result.ok, true);
    assert.equal(result.value.company, "");
    assert.equal(result.value.message, sample().message);
  });
  await check("English and Danish quotes have one language-independent kind", () => {
    for (const payload of [
      sample({ kind: "quote", subject: "Quote request", page: "/en/get-a-quote" }),
      sample({ kind: undefined, subject: "Tilbudsforespørgsel", page: "/tilbud" }),
      sample({ kind: undefined, subject: "Quote request", page: "/en/get-a-quote" }),
      sample({ kind: undefined, subject: "Custom enquiry", page: "/en/get-a-quote" }),
    ]) {
      const result = contact.validateContactPayload(payload);
      assert.equal(result.ok, true);
      assert.equal(result.value.kind, "quote");
    }
    assert.equal(
      contact.validateContactPayload(sample({ subject: "Quote request" })).value.kind,
      "contact",
    );
    assert.equal(contact.validateContactPayload(sample({ kind: "instagram" })).ok, false);
  });
  await check("every accepted field retains its ending at the shared limit", () => {
    for (const [field, limit] of Object.entries(contact.CONTACT_LIMITS)) {
      const value =
        field === "email" ? `${"x".repeat(limit - 16)}@example.invalid` : "x".repeat(limit);
      const accepted = contact.validateContactPayload(sample({ [field]: value }));
      assert.equal(accepted.ok, true, field);
      assert.equal(accepted.value[field], value, field);
      const rejected = contact.validateContactPayload(sample({ [field]: value + "x" }));
      assert.equal(rejected.ok, false, field);
      assert.ok(rejected.fields.includes(field), field);
    }
  });
  await check("quote specifications consume the same message budget", () => {
    const details = ["How many machines? 10–49", "Equipment or model: Synthetic model", null];
    const prefix = contact.composeEnquiryMessage("", details);
    const prose = "x".repeat(contact.CONTACT_LIMITS.message - prefix.length - 2);
    const composed = contact.composeEnquiryMessage(prose, details);
    assert.equal(composed.length, contact.CONTACT_LIMITS.message);
    assert.equal(contact.validateContactPayload(sample({ message: composed })).ok, true);
    assert.equal(contact.validateContactPayload(sample({ message: composed + "x" })).ok, false);
    assert.equal(contact.composeEnquiryMessage("Only prose"), "Only prose");
  });
  await check("blank names/messages and unsafe email headers cannot become enquiries", () => {
    for (const change of [
      { name: "   " },
      { message: "\n\t " },
      { email: "x@example.invalid\nBcc: x@example.invalid" },
    ])
      assert.equal(contact.validateContactPayload(sample(change)).ok, false);
  });

  const stored = [];
  const route = loadTypeScript("app/api/kontakt/route.ts", {
    "next/server": { NextResponse: Response },
    "@/lib/company": { company: { email: "synthetic@example.invalid" } },
    "@/lib/db": {
      saveEnquiry: async (value) => {
        stored.push(value);
        return true;
      },
      noteMailFailure: async () => {},
    },
  });
  let sequence = 0;
  const post = (body, headers = {}) =>
    route.POST(
      new Request("https://www.kestro.dk/api/kontakt", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "sec-fetch-site": "same-origin",
          "x-real-ip": `synthetic-${sequence++}`,
          ...headers,
        },
        body: typeof body === "string" ? body : JSON.stringify(body),
      }),
    );
  await check("the actual route rejects oversized fields before any storage", async () => {
    const before = stored.length;
    const response = await post(sample({ message: "x".repeat(5001) }));
    assert.equal(response.status, 422);
    assert.ok((await response.json()).fields.includes("message"));
    assert.equal(stored.length, before);
  });
  await check("the actual route stores a full English quote and its correct source", async () => {
    const response = await post(
      sample({ kind: "quote", subject: "Quote request", message: "x".repeat(4997) + "END" }),
    );
    assert.equal(response.status, 200);
    assert.equal(stored.at(-1).source, "quote");
    assert.equal(stored.at(-1).message.length, 5000);
    assert.ok(stored.at(-1).message.endsWith("END"));
  });
  await check("same-site, media-type and byte ceilings remain active", async () => {
    const before = stored.length;
    assert.equal((await post(sample(), { "sec-fetch-site": "cross-site" })).status, 403);
    assert.equal((await post(sample(), { "content-type": "text/plain" })).status, 415);
    assert.equal((await post(JSON.stringify({ message: "ø".repeat(33000) }))).status, 413);
    assert.equal(stored.length, before);
  });
  await check("honeypot and the existing five-attempt rate limit remain active", async () => {
    const before = stored.length;
    assert.equal((await post(sample({ website: "synthetic bot" }))).status, 200);
    assert.equal(stored.length, before);
    for (let attempt = 0; attempt < 5; attempt++)
      assert.equal(
        (await post(sample({ name: "" }), { "x-real-ip": "synthetic-rate" })).status,
        422,
      );
    assert.equal((await post(sample(), { "x-real-ip": "synthetic-rate" })).status, 429);
    assert.equal(stored.length, before);
  });
  return checked;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(`contact data: ${await verifyContactData()} checks passed`);
}
