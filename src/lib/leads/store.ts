import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import {
  pgDeleteLead,
  pgFindLeadByEmail,
  pgFindLeadByTawkChatId,
  pgGetLead,
  pgListLeads,
  pgSaveLead,
} from "@/lib/leads/postgres";
import {
  normalizeLead,
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

export { normalizeLead } from "@/lib/leads/types";

type LeadIndex = { ids: string[]; updatedAt: string };

function hasPostgres() {
  return Boolean(process.env.POSTGRES_URL?.trim());
}

function isProduction() {
  return process.env.NODE_ENV === "production";
}

function storageBackend(): "postgres" | "filesystem" {
  if (hasPostgres()) return "postgres";
  if (isProduction()) {
    throw new Error(
      "POSTGRES_URL is not set. Add a Vercel Postgres (Neon) database on Production and redeploy — demo leads cannot use the serverless filesystem.",
    );
  }
  return "filesystem";
}

/** Production must use Postgres; local dev may use filesystem. */
function assertWritable() {
  storageBackend();
}

function leadsDir() {
  return path.join(process.cwd(), "content", "leads");
}

function defaultAssignee(): string {
  return defaultAssigneeEmail();
}

async function ensureFsDir() {
  await fs.mkdir(leadsDir(), { recursive: true });
}

async function readIndex(): Promise<LeadIndex> {
  try {
    const raw = await fs.readFile(path.join(leadsDir(), "index.json"), "utf8");
    return JSON.parse(raw) as LeadIndex;
  } catch {
    return { ids: [], updatedAt: new Date().toISOString() };
  }
}

async function writeIndex(ids: string[]) {
  assertWritable();
  await ensureFsDir();
  const idx: LeadIndex = {
    ids: [...new Set(ids)],
    updatedAt: new Date().toISOString(),
  };
  await fs.writeFile(
    path.join(leadsDir(), "index.json"),
    `${JSON.stringify(idx, null, 2)}\n`,
    "utf8",
  );
}

async function fsWriteLeadFile(lead: Lead) {
  assertWritable();
  await ensureFsDir();
  await fs.writeFile(
    path.join(leadsDir(), `${lead.id}.json`),
    `${JSON.stringify(lead, null, 2)}\n`,
    "utf8",
  );
}

export function summarize(lead: Lead): LeadSummary {
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

export function leadsStorageMode(): "postgres" | "filesystem" {
  return hasPostgres() ? "postgres" : "filesystem";
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
  if (hasPostgres()) return pgFindLeadByEmail(email);
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
  if (hasPostgres()) return pgFindLeadByTawkChatId(chatId);
  const leads = await listLeads();
  return leads.find((l) => l.tawkChatId === chatId) ?? null;
}

export async function createLead(input: CreateLeadInput): Promise<Lead> {
  assertWritable();
  const now = new Date().toISOString();
  const id = randomUUID();

  const lead: Lead = {
    id,
    name: input.name,
    email: input.email,
    phone: input.phone,
    companyName: input.companyName,
    vertical: input.vertical,
    inquiryType:
      input.inquiryType ?? resolveInquiryType({ vertical: input.vertical }),
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

  if (hasPostgres()) {
    return pgSaveLead(lead);
  }

  await fsWriteLeadFile(lead);
  try {
    const idx = await readIndex();
    await writeIndex([lead.id, ...idx.ids]);
  } catch (err) {
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

  if (hasPostgres()) {
    return pgSaveLead(lead);
  }

  await fsWriteLeadFile(lead);
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
    sourceDetail:
      [input.referrer, location].filter(Boolean).join(" · ") || undefined,
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

  if (hasPostgres()) {
    const saved = await pgSaveLead(lead);
    return { lead: saved, created: true };
  }

  await fsWriteLeadFile(lead);
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
  if (hasPostgres()) return pgGetLead(clean);
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

export async function listLeads(): Promise<Lead[]> {
  if (hasPostgres()) return pgListLeads();

  const leads: Lead[] = [];
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
  if (hasPostgres()) return pgSaveLead(lead);
  lead.updatedAt = new Date().toISOString();
  await fsWriteLeadFile(lead);
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
  if (hasPostgres()) {
    await pgDeleteLead(id);
    return;
  }
  try {
    await fs.unlink(path.join(leadsDir(), `${id}.json`));
  } catch {
    /* ignore */
  }
  try {
    const idx = await readIndex();
    await writeIndex(idx.ids.filter((x) => x !== id));
  } catch {
    /* ignore */
  }
}
