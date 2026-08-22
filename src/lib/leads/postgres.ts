import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";
import path from "node:path";
import { normalizeLead, type Lead } from "@/lib/leads/types";
import { resolveInquiryType } from "@/lib/leads/types";

let schemaReady: Promise<void> | null = null;

function sql() {
  const url = process.env.POSTGRES_URL?.trim();
  if (!url) throw new Error("POSTGRES_URL is not set.");
  return neon(url);
}

async function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      const schemaPath = path.join(process.cwd(), "src/lib/leads/schema.sql");
      const ddl = readFileSync(schemaPath, "utf8");
      const db = sql();
      const statements = ddl
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      for (const statement of statements) {
        await db.query(statement);
      }
    })();
  }
  await schemaReady;
}

function rowToLead(data: unknown): Lead {
  return normalizeLead(data as Lead);
}

function leadToRow(lead: Lead) {
  const normalized = normalizeLead(lead);
  return {
    id: normalized.id,
    email: normalized.email,
    status: normalized.status,
    source: normalized.source,
    inquiry_type: resolveInquiryType(normalized),
    assignee: normalized.assignee,
    company_name: normalized.companyName,
    demo_start: normalized.start,
    created_at: normalized.createdAt,
    updated_at: normalized.updatedAt,
    data: JSON.stringify(normalized),
  };
}

export async function pgGetLead(id: string): Promise<Lead | null> {
  await ensureSchema();
  const db = sql();
  const rows = await db`
    SELECT data FROM leads WHERE id = ${id.trim()} LIMIT 1
  `;
  if (!rows.length) return null;
  return rowToLead(rows[0].data);
}

export async function pgListLeads(): Promise<Lead[]> {
  await ensureSchema();
  const db = sql();
  const rows = await db`
    SELECT data FROM leads ORDER BY created_at DESC
  `;
  return rows.map((r) => rowToLead(r.data));
}

export async function pgSaveLead(lead: Lead): Promise<Lead> {
  await ensureSchema();
  const normalized = normalizeLead({
    ...lead,
    updatedAt: new Date().toISOString(),
  });
  const row = leadToRow(normalized);
  const db = sql();
  await db`
    INSERT INTO leads (
      id, email, status, source, inquiry_type, assignee,
      company_name, demo_start, created_at, updated_at, data
    ) VALUES (
      ${row.id},
      ${row.email},
      ${row.status},
      ${row.source},
      ${row.inquiry_type},
      ${row.assignee},
      ${row.company_name},
      ${row.demo_start},
      ${row.created_at},
      ${row.updated_at},
      ${row.data}::jsonb
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
  return normalized;
}

export async function pgFindLeadByEmail(email: string): Promise<Lead | null> {
  const needle = email.trim().toLowerCase();
  if (!needle) return null;
  await ensureSchema();
  const db = sql();
  const rows = await db`
    SELECT data FROM leads WHERE LOWER(email) = ${needle} LIMIT 1
  `;
  if (!rows.length) return null;
  return rowToLead(rows[0].data);
}

export async function pgFindLeadByTawkChatId(
  chatId: string,
): Promise<Lead | null> {
  if (!chatId.trim()) return null;
  await ensureSchema();
  const db = sql();
  const rows = await db`
    SELECT data FROM leads WHERE data->>'tawkChatId' = ${chatId.trim()} LIMIT 1
  `;
  if (!rows.length) return null;
  return rowToLead(rows[0].data);
}

export async function pgDeleteLead(id: string): Promise<void> {
  await ensureSchema();
  const db = sql();
  await db`DELETE FROM leads WHERE id = ${id.trim()}`;
}
