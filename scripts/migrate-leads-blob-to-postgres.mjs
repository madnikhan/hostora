#!/usr/bin/env node
/**
 * One-time import of leads from Vercel Blob → Postgres.
 *
 * Usage (from repo root):
 *   BLOB_READ_WRITE_TOKEN=... POSTGRES_URL=... node scripts/migrate-leads-blob-to-postgres.mjs
 *
 * Uses POSTGRES_URL_NON_POOLING if set (better for DDL/migration).
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { list } from "@vercel/blob";
import { neon } from "@neondatabase/serverless";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LEAD_PREFIX = "leads/";
const INDEX_PATH = "leads/index.json";

const blobToken = process.env.BLOB_READ_WRITE_TOKEN?.trim();
const postgresUrl =
  process.env.POSTGRES_URL_NON_POOLING?.trim() ||
  process.env.POSTGRES_URL?.trim();

if (!blobToken) {
  console.error("Missing BLOB_READ_WRITE_TOKEN");
  process.exit(1);
}
if (!postgresUrl) {
  console.error("Missing POSTGRES_URL (or POSTGRES_URL_NON_POOLING)");
  process.exit(1);
}

function normalizeLead(raw) {
  const IT = new Set(["Corporate", "NHS site", "Motor", "Home office", "Other"]);
  const inquiryType =
    raw.inquiryType ||
    (IT.has(raw.vertical) ? "it_services" : "hospitality");
  return {
    ...raw,
    inquiryType,
    source: raw.source ?? "website",
    notes: raw.notes ?? [],
    calls: raw.calls ?? [],
    tasks: raw.tasks ?? [],
  };
}

async function main() {
  const sql = neon(postgresUrl);
  const schemaPath = path.join(__dirname, "../src/lib/leads/schema.sql");
  const ddl = readFileSync(schemaPath, "utf8");
  const statements = ddl
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  for (const statement of statements) {
    await sql.query(statement);
  }
  console.log("Schema ready.");

  const { blobs } = await list({ prefix: LEAD_PREFIX, token: blobToken });
  const leadBlobs = blobs.filter(
    (b) =>
      b.pathname.endsWith(".json") &&
      b.pathname !== INDEX_PATH &&
      b.pathname.startsWith(LEAD_PREFIX),
  );

  console.log(`Found ${leadBlobs.length} lead file(s) in Blob.`);

  let upserted = 0;
  const sampleIds = [];

  for (const blob of leadBlobs) {
    const res = await fetch(blob.url);
    if (!res.ok) {
      console.warn(`Skip ${blob.pathname}: HTTP ${res.status}`);
      continue;
    }
    const raw = await res.json();
    const lead = normalizeLead(raw);
    if (!lead?.id) {
      console.warn(`Skip ${blob.pathname}: missing id`);
      continue;
    }

    await sql`
      INSERT INTO leads (
        id, email, status, source, inquiry_type, assignee,
        company_name, demo_start, created_at, updated_at, data
      ) VALUES (
        ${lead.id},
        ${lead.email},
        ${lead.status},
        ${lead.source},
        ${lead.inquiryType},
        ${lead.assignee},
        ${lead.companyName},
        ${lead.start},
        ${lead.createdAt},
        ${lead.updatedAt},
        ${JSON.stringify(lead)}::jsonb
      )
      ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        status = EXCLUDED.status,
        source = EXCLUDED.source,
        inquiry_type = EXCLUDED.inquiry_type,
        assignee = EXCLUDED.assignee,
        company_name = EXCLUDED.company_name,
        demo_start = EXCLUDED.demo_start,
        updated_at = EXCLUDED.updated_at,
        data = EXCLUDED.data
    `;
    upserted++;
    if (sampleIds.length < 5) sampleIds.push(lead.id);
  }

  const countRows = await sql`SELECT COUNT(*)::int AS n FROM leads`;
  const total = countRows[0]?.n ?? 0;

  console.log(`Upserted ${upserted} lead(s) from Blob.`);
  console.log(`Postgres leads table now has ${total} row(s).`);
  if (sampleIds.length) {
    console.log("Sample IDs:", sampleIds.join(", "));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
