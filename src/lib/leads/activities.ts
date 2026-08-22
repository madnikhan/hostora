import type { Lead, LeadActivity } from "@/lib/leads/types";

export function buildLeadActivities(lead: Lead): LeadActivity[] {
  const items: LeadActivity[] = [];

  for (const n of lead.notes) {
    items.push({
      kind: "note",
      id: n.id,
      at: n.createdAt,
      body: n.body,
      author: n.author,
    });
  }
  for (const c of lead.calls) {
    items.push({
      kind: "call",
      id: c.id,
      at: c.createdAt,
      outcome: c.outcome,
      note: c.note,
      author: c.author,
    });
  }
  for (const t of lead.tasks) {
    items.push({
      kind: "task",
      id: t.id,
      at: t.createdAt,
      title: t.title,
      type: t.type,
      dueAt: t.dueAt,
      done: t.done,
      doneAt: t.doneAt,
    });
  }

  if (lead.chatTranscript) {
    items.push({
      kind: "note",
      id: "chat-transcript",
      at: lead.updatedAt,
      body: `[Chat transcript]\n${lead.chatTranscript}`,
    });
  }

  return items.sort(
    (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime(),
  );
}

export function leadsToCsv(leads: Lead[]): string {
  const header = [
    "id",
    "company",
    "name",
    "email",
    "phone",
    "vertical",
    "inquiryType",
    "status",
    "source",
    "sourceDetail",
    "assignee",
    "demoStart",
    "quoteAmount",
    "createdAt",
  ];
  const rows = leads.map((l) =>
    [
      l.id,
      l.companyName,
      l.name,
      l.email,
      l.phone,
      l.vertical,
      l.inquiryType ?? "hospitality",
      l.status,
      l.source,
      l.sourceDetail ?? "",
      l.assignee,
      l.start,
      l.quoteAmount ?? "",
      l.createdAt,
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(","),
  );
  return [header.join(","), ...rows].join("\n");
}
