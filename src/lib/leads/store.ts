import { del, list, put } from "@vercel/blob";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import {
  resolveInquiryType,
  type InquiryType,
  type Lead,
  type LeadCall,
  type LeadNote,
  type LeadSource,
  type LeadStatus,
  type LeadSummary,
  type LeadTask,
  type LeadUtm,
  type TaskType,
  type CallOutcome,
} from "@/lib/leads/types";
import { defaultAssigneeEmail } from "@/lib/leads/team";

const LEAD_PREFIX = "leads/";
const INDEX_PATH = "leads/index.json";

type LeadIndex = { ids: string[]; updatedAt: string };

function hasBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

function isProduction() {
  return process.env.NODE_ENV === "production";
}

/** Production must use Blob; local dev may use filesystem. */
function assertWritable() {
  if (hasBlob()) return;
  if (isProduction()) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is not set. Add it on Vercel Production (same Blob store as blog) and redeploy — demo leads cannot use the serverless filesystem.",
    );
  }
}

function leadsDir() {
  return path.join(process.cwd(), "content", "leads");
}

function defaultAssignee(): string {
  return defaultAssigneeEmail();
}

/** Backfill defaults for leads created before source fields existed. */
export function normalizeLead(raw: Lead): Lead {
  const inquiryType = resolveInquiryType(raw);
  return {
    ...raw,
    inquiryType,
    source: raw.source ?? "website",
    notes: raw.notes ?? [],
    calls: raw.calls ?? [],
    tasks: raw.tasks ?? [],
  };
}

async function putJson(pathname: string, data: unknown) {
  assertWritable();
  if (!hasBlob()) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not set.");
  }
  await put(pathname, JSON.stringify(data, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

async function readJsonBlob<T>(pathname: string): Promise<T | null> {
  if (!hasBlob()) return null;
  try {
    const { blobs } = await list({ prefix: pathname });
    const hit = blobs.find((b) => b.pathname === pathname);
    if (!hit) return null;
    const res = await fetch(hit.url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function ensureFsDir() {
  await fs.mkdir(leadsDir(), { recursive: true });
}

async function readIndex(): Promise<LeadIndex> {
  if (hasBlob()) {
    const idx = await readJsonBlob<LeadIndex>(INDEX_PATH);
    if (idx?.ids) return idx;
    return { ids: [], updatedAt: new Date().toISOString() };
  }
  try {
    const raw = await fs.readFile(path.join(leadsDir(), "index.json"), "utf8");
    return JSON.parse(raw) as LeadIndex;
  } catch {
    return { ids: [], updatedAt: new Date().toISOString() };
  }
}

async function writeIndex(ids: string[]) {
  const idx: LeadIndex = {
    ids: [...new Set(ids)],
    updatedAt: new Date().toISOString(),
  };
  if (hasBlob()) {
    await putJson(INDEX_PATH, idx);
    return;
  }
  assertWritable();
  await ensureFsDir();
  await fs.writeFile(
    path.join(leadsDir(), "index.json"),
    `${JSON.stringify(idx, null, 2)}\n`,
    "utf8",
  );
}

async function writeLeadFile(lead: Lead) {
  const pathname = `${LEAD_PREFIX}${lead.id}.json`;
  if (hasBlob()) {
    await putJson(pathname, lead);
    return;
  }
  assertWritable();
  await ensureFsDir();
  await fs.writeFile(
    path.join(leadsDir(), `${lead.id}.json`),
    `${JSON.stringify(lead, null, 2)}\n`,
    "utf8",
  );
}

function summarize(lead: Lead): LeadSummary {
  const now = Date.now();
  const open = lead.tasks.filter((t) => !t.done);
  const overdue = open.filter((t) => new Date(t.dueAt).getTime() < now);
  return {
    id: lead.id,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    companyName: lead.companyName,
    vertical: lead.vertical,
    inquiryType: resolveInquiryType(lead),
    start: lead.start,
    status: lead.status,
    assignee: lead.assignee,
    source: lead.source,
    sourceDetail: lead.sourceDetail,
    createdAt: lead.createdAt,
    updatedAt: lead.updatedAt,
    openTasks: open.length,
    overdueTasks: overdue.length,
  };
}

export function leadsStorageMode(): "blob" | "filesystem" {
  return hasBlob() ? "blob" : "filesystem";
}

export type CreateLeadInput = {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  vertical: string;
  inquiryType?: InquiryType;
  start: string;
  meetLink: string | null;
  calendarEventId: string | null;
  htmlLink: string | null;
  utm?: LeadUtm;
  source?: LeadSource;
  sourceDetail?: string;
};

export type ManualLeadInput = {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  vertical: string;
  inquiryType?: InquiryType;
  source: LeadSource;
  sourceDetail?: string;
  facebookGroup?: string;
  assignee?: string;
  start?: string;
  note?: string;
};

export type TawkLeadInput = {
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  tawkChatId: string;
  message?: string;
  referrer?: string;
  country?: string;
  city?: string;
};

function buildInitialTasks(startIso: string, includeDemoFollowUp: boolean) {
  const now = new Date().toISOString();
  const tasks: LeadTask[] = [];
  if (includeDemoFollowUp) {
    const demoStart = new Date(startIso);
    const followDue = new Date(demoStart.getTime() + 24 * 60 * 60 * 1000);
    tasks.push({
      id: randomUUID(),
      type: "call",
      title: "Post-demo follow-up call",
      dueAt: followDue.toISOString(),
      remindAt: followDue.toISOString(),
      done: false,
      createdAt: now,
    });
  }
  return tasks;
}

export async function findLeadByEmail(
  email: string,
): Promise<Lead | null> {
  const needle = email.trim().toLowerCase();
  if (!needle) return null;
  const leads = await listLeads();
  return (
    leads.find((l) => l.email.trim().toLowerCase() === needle) ?? null
  );
}

export async function findLeadByTawkChatId(
  chatId: string,
): Promise<Lead | null> {
  const leads = await listLeads();
  return leads.find((l) => l.tawkChatId === chatId) ?? null;
}

export async function createLead(input: CreateLeadInput): Promise<Lead> {
  assertWritable();
  const now = new Date().toISOString();
  const id = randomUUID();
  const demoStart = new Date(input.start);
  const followDue = new Date(demoStart.getTime() + 24 * 60 * 60 * 1000);
  void followDue;

  const lead: Lead = {
    id,
    name: input.name,
    email: input.email,
    phone: input.phone,
    companyName: input.companyName,
    vertical: input.vertical,
    inquiryType: input.inquiryType ?? resolveInquiryType({ vertical: input.vertical }),
    start: input.start,
    meetLink: input.meetLink,
    calendarEventId: input.calendarEventId,
    htmlLink: input.htmlLink,
    status: "new",
    assignee: defaultAssignee(),
    source: input.source ?? "website",
    sourceDetail: input.sourceDetail,
    notes: [],
    calls: [],
    tasks: buildInitialTasks(input.start, true),
    utm: input.utm,
    createdAt: now,
    updatedAt: now,
  };

  await writeLeadFile(lead);
  try {
    const idx = await readIndex();
    await writeIndex([lead.id, ...idx.ids]);
  } catch (err) {
    // Lead file is source of truth; index is optional cache
    console.error("lead index update failed", err);
  }
  return lead;
}

export async function createManualLead(
  input: ManualLeadInput,
): Promise<Lead> {
  assertWritable();
  const now = new Date().toISOString();
  const id = randomUUID();
  const start = input.start ?? now;
  const hasDemo = Boolean(input.start);
  const notes: LeadNote[] = [];
  if (input.note?.trim()) {
    notes.push({
      id: randomUUID(),
      body: input.note.trim(),
      createdAt: now,
    });
  }

  const lead: Lead = {
    id,
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    companyName: input.companyName.trim(),
    vertical: input.vertical.trim(),
    inquiryType:
      input.inquiryType ??
      resolveInquiryType({ vertical: input.vertical.trim() }),
    start,
    meetLink: null,
    calendarEventId: null,
    htmlLink: null,
    status: "new",
    assignee: input.assignee?.trim() || defaultAssignee(),
    source: input.source,
    sourceDetail: input.sourceDetail?.trim(),
    facebookGroup: input.facebookGroup?.trim(),
    notes,
    calls: [],
    tasks: hasDemo ? buildInitialTasks(start, true) : [],
    createdAt: now,
    updatedAt: now,
  };

  await writeLeadFile(lead);
  try {
    const idx = await readIndex();
    await writeIndex([lead.id, ...idx.ids]);
  } catch (err) {
    console.error("lead index update failed", err);
  }
  return lead;
}

export async function createOrUpdateTawkLead(
  input: TawkLeadInput,
): Promise<{ lead: Lead; created: boolean }> {
  const existingByChat = await findLeadByTawkChatId(input.tawkChatId);
  if (existingByChat) {
    const noteBody = [
      input.message ? `New message: ${input.message}` : null,
      input.referrer ? `Page: ${input.referrer}` : null,
    ]
      .filter(Boolean)
      .join("\n");
    if (noteBody) await addLeadNote(existingByChat.id, noteBody, "tawk");
    const refreshed = await getLead(existingByChat.id);
    return { lead: refreshed!, created: false };
  }

  const existingByEmail = input.email
    ? await findLeadByEmail(input.email)
    : null;
  if (existingByEmail) {
    const lead = await getLead(existingByEmail.id);
    if (!lead) {
      return { lead: existingByEmail, created: false };
    }
    lead.tawkChatId = input.tawkChatId;
    const noteBody = [
      "Tawk chat linked to existing lead.",
      input.message ? `Message: ${input.message}` : null,
      input.referrer ? `Page: ${input.referrer}` : null,
    ]
      .filter(Boolean)
      .join("\n");
    lead.notes.unshift({
      id: randomUUID(),
      body: noteBody,
      createdAt: new Date().toISOString(),
      author: "tawk",
    });
    const saved = await saveLead(lead);
    return { lead: saved, created: false };
  }

  assertWritable();
  const now = new Date().toISOString();
  const id = randomUUID();
  const followDue = new Date(Date.now() + 4 * 60 * 60 * 1000);
  const location = [input.city, input.country].filter(Boolean).join(", ");
  const notes: LeadNote[] = [];
  if (input.message?.trim()) {
    notes.push({
      id: randomUUID(),
      body: `First chat message: ${input.message.trim()}`,
      createdAt: now,
      author: "tawk",
    });
  }

  const lead: Lead = {
    id,
    name: input.name.trim() || "Tawk visitor",
    email: input.email.trim(),
    phone: input.phone?.trim() || "",
    companyName: input.companyName?.trim() || "Unknown venue",
    vertical: "Unknown",
    inquiryType: "hospitality",
    start: now,
    meetLink: null,
    calendarEventId: null,
    htmlLink: null,
    status: "new",
    assignee: defaultAssignee(),
    source: "tawk_chat",
    sourceDetail: [input.referrer, location].filter(Boolean).join(" · ") || undefined,
    tawkChatId: input.tawkChatId,
    notes,
    calls: [],
    tasks: [
      {
        id: randomUUID(),
        type: "call",
        title: "Follow up Tawk chat",
        dueAt: followDue.toISOString(),
        remindAt: followDue.toISOString(),
        done: false,
        createdAt: now,
      },
    ],
    createdAt: now,
    updatedAt: now,
  };

  await writeLeadFile(lead);
  try {
    const idx = await readIndex();
    await writeIndex([lead.id, ...idx.ids]);
  } catch (err) {
    console.error("lead index update failed", err);
  }
  return { lead, created: true };
}

export async function appendTawkTranscript(
  chatId: string,
  transcript: string,
): Promise<Lead | null> {
  const lead = await findLeadByTawkChatId(chatId);
  if (!lead) return null;
  lead.chatTranscript = transcript.trim();
  return saveLead(lead);
}

export async function updateLeadMeta(
  id: string,
  patch: {
    quoteAmount?: number | null;
    lostReason?: string | null;
    sourceDetail?: string;
  },
): Promise<Lead | null> {
  const lead = await getLead(id);
  if (!lead) return null;
  if (patch.quoteAmount !== undefined) {
    lead.quoteAmount = patch.quoteAmount ?? undefined;
  }
  if (patch.lostReason !== undefined) {
    lead.lostReason = patch.lostReason?.trim() || undefined;
  }
  if (patch.sourceDetail !== undefined) {
    lead.sourceDetail = patch.sourceDetail.trim() || undefined;
  }
  return saveLead(lead);
}

export async function getLead(id: string): Promise<Lead | null> {
  const clean = id.trim();
  if (!clean) return null;
  if (isProduction() && !hasBlob()) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is not set. Add it on Vercel Production and redeploy.",
    );
  }
  if (hasBlob()) {
    const raw = await readJsonBlob<Lead>(`${LEAD_PREFIX}${clean}.json`);
    return raw ? normalizeLead(raw) : null;
  }
  try {
    const raw = await fs.readFile(
      path.join(leadsDir(), `${clean}.json`),
      "utf8",
    );
    return normalizeLead(JSON.parse(raw) as Lead);
  } catch {
    return null;
  }
}

/** Primary listing: scan all lead JSON files (index is not required). */
export async function listLeads(): Promise<Lead[]> {
  if (isProduction() && !hasBlob()) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is not set. Add it on Vercel Production and redeploy.",
    );
  }

  const leads: Lead[] = [];

  if (hasBlob()) {
    const { blobs } = await list({ prefix: LEAD_PREFIX });
    for (const blob of blobs) {
      if (!blob.pathname.endsWith(".json")) continue;
      if (blob.pathname === INDEX_PATH) continue;
      if (!blob.pathname.startsWith(LEAD_PREFIX)) continue;
      try {
        const res = await fetch(blob.url, { cache: "no-store" });
        if (!res.ok) continue;
        const lead = normalizeLead((await res.json()) as Lead);
        if (lead?.id) leads.push(lead);
      } catch {
        /* skip corrupt */
      }
    }
  } else {
    try {
      await ensureFsDir();
      const files = await fs.readdir(leadsDir());
      for (const file of files) {
        if (!file.endsWith(".json") || file === "index.json") continue;
        const raw = await fs.readFile(path.join(leadsDir(), file), "utf8");
        const lead = normalizeLead(JSON.parse(raw) as Lead);
        if (lead?.id) leads.push(lead);
      }
    } catch {
      /* empty */
    }
  }

  return leads.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function listLeadSummaries(): Promise<LeadSummary[]> {
  const leads = await listLeads();
  return leads.map(summarize);
}

async function saveLead(lead: Lead): Promise<Lead> {
  lead.updatedAt = new Date().toISOString();
  await writeLeadFile(lead);
  return lead;
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus,
): Promise<Lead | null> {
  const lead = await getLead(id);
  if (!lead) return null;
  lead.status = status;
  return saveLead(lead);
}

export async function updateLeadAssignee(
  id: string,
  assignee: string,
): Promise<Lead | null> {
  const lead = await getLead(id);
  if (!lead) return null;
  lead.assignee = assignee.trim();
  return saveLead(lead);
}

export async function addLeadNote(
  id: string,
  body: string,
  author?: string,
): Promise<Lead | null> {
  const lead = await getLead(id);
  if (!lead) return null;
  const note: LeadNote = {
    id: randomUUID(),
    body: body.trim(),
    createdAt: new Date().toISOString(),
    author,
  };
  lead.notes.unshift(note);
  return saveLead(lead);
}

export async function addLeadCall(
  id: string,
  outcome: CallOutcome,
  note?: string,
  author?: string,
): Promise<Lead | null> {
  const lead = await getLead(id);
  if (!lead) return null;
  const call: LeadCall = {
    id: randomUUID(),
    outcome,
    note: note?.trim() || undefined,
    createdAt: new Date().toISOString(),
    author,
  };
  lead.calls.unshift(call);
  if (lead.status === "new") lead.status = "contacted";
  return saveLead(lead);
}

export async function addLeadTask(
  id: string,
  input: {
    type: TaskType;
    title: string;
    dueAt: string;
    remindAt?: string;
  },
): Promise<Lead | null> {
  const lead = await getLead(id);
  if (!lead) return null;
  const task: LeadTask = {
    id: randomUUID(),
    type: input.type,
    title: input.title.trim(),
    dueAt: input.dueAt,
    remindAt: input.remindAt || input.dueAt,
    done: false,
    createdAt: new Date().toISOString(),
  };
  lead.tasks.unshift(task);
  return saveLead(lead);
}

export async function completeLeadTask(
  id: string,
  taskId: string,
): Promise<Lead | null> {
  const lead = await getLead(id);
  if (!lead) return null;
  const task = lead.tasks.find((t) => t.id === taskId);
  if (!task) return null;
  task.done = true;
  task.doneAt = new Date().toISOString();
  return saveLead(lead);
}

export type DueReminder = {
  lead: Lead;
  task: LeadTask;
};

/** Open tasks whose dueAt or remindAt is on or before end of today (UTC day). */
export async function listDueReminders(now = new Date()): Promise<DueReminder[]> {
  const endOfDay = new Date(now);
  endOfDay.setUTCHours(23, 59, 59, 999);
  const cutoff = endOfDay.getTime();
  const leads = await listLeads();
  const out: DueReminder[] = [];
  for (const lead of leads) {
    for (const task of lead.tasks) {
      if (task.done) continue;
      const due = new Date(task.remindAt || task.dueAt).getTime();
      if (due <= cutoff) out.push({ lead, task });
    }
  }
  return out;
}

/** @internal test helper — not for production delete UI in v1 */
export async function deleteLead(id: string): Promise<void> {
  if (hasBlob()) {
    const { blobs } = await list({ prefix: `${LEAD_PREFIX}${id}.json` });
    for (const b of blobs) {
      if (b.pathname === `${LEAD_PREFIX}${id}.json`) await del(b.url);
    }
  } else {
    try {
      await fs.unlink(path.join(leadsDir(), `${id}.json`));
    } catch {
      /* ignore */
    }
  }
  try {
    const idx = await readIndex();
    await writeIndex(idx.ids.filter((x) => x !== id));
  } catch {
    /* ignore */
  }
}
