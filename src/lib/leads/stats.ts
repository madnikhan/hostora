import type { InquiryType, Lead, LeadSource, LeadStatus } from "@/lib/leads/types";
import { resolveInquiryType } from "@/lib/leads/types";

export type LeadStats = {
  total: number;
  byStatus: Record<LeadStatus, number>;
  bySource: Record<LeadSource, number>;
  byInquiryType: Record<InquiryType, number>;
  newThisWeek: number;
  demosNext24h: number;
  overdueTasks: number;
  openTasks: number;
};

function startOfWeek(d = new Date()): Date {
  const x = new Date(d);
  const day = x.getUTCDay();
  const diff = day === 0 ? 6 : day - 1;
  x.setUTCDate(x.getUTCDate() - diff);
  x.setUTCHours(0, 0, 0, 0);
  return x;
}

export function computeLeadStats(leads: Lead[]): LeadStats {
  const now = Date.now();
  const weekStart = startOfWeek().getTime();
  const next24h = now + 24 * 60 * 60 * 1000;

  const byStatus = {
    new: 0,
    contacted: 0,
    demo_done: 0,
    quoted: 0,
    won: 0,
    lost: 0,
    no_show: 0,
  } satisfies Record<LeadStatus, number>;

  const bySource = {
    website: 0,
    facebook_group: 0,
    tawk_chat: 0,
    referral: 0,
    cold_call: 0,
    whatsapp: 0,
    other: 0,
  } satisfies Record<LeadSource, number>;

  const byInquiryType = {
    hospitality: 0,
    it_services: 0,
  } satisfies Record<InquiryType, number>;

  let newThisWeek = 0;
  let demosNext24h = 0;
  let overdueTasks = 0;
  let openTasks = 0;

  for (const lead of leads) {
    byStatus[lead.status]++;
    bySource[lead.source]++;
    byInquiryType[resolveInquiryType(lead)]++;
    if (new Date(lead.createdAt).getTime() >= weekStart) newThisWeek++;
    const demoAt = new Date(lead.start).getTime();
    if (demoAt >= now && demoAt <= next24h) demosNext24h++;
    for (const t of lead.tasks) {
      if (t.done) continue;
      openTasks++;
      if (new Date(t.dueAt).getTime() < now) overdueTasks++;
    }
  }

  return {
    total: leads.length,
    byStatus,
    bySource,
    byInquiryType,
    newThisWeek,
    demosNext24h,
    overdueTasks,
    openTasks,
  };
}

export function filterLeadsForAssignee(leads: Lead[], assignee: string): Lead[] {
  const needle = assignee.trim().toLowerCase();
  if (!needle) return leads;
  return leads.filter((l) => l.assignee.toLowerCase() === needle);
}
