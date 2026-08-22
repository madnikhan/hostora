export const LEAD_STATUSES = [
  "new",
  "contacted",
  "demo_done",
  "quoted",
  "won",
  "lost",
  "no_show",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_SOURCES = [
  "website",
  "facebook_group",
  "tawk_chat",
  "referral",
  "cold_call",
  "whatsapp",
  "other",
] as const;

export type LeadSource = (typeof LEAD_SOURCES)[number];

export const INQUIRY_TYPES = ["hospitality", "it_services"] as const;

export type InquiryType = (typeof INQUIRY_TYPES)[number];

/** Business IT verticals (Track B — K WAZIR LTD install/services). */
export const IT_VERTICALS = [
  "Corporate",
  "NHS site",
  "Motor",
  "Home office",
  "Other",
] as const;

export type ItVertical = (typeof IT_VERTICALS)[number];

export const CALL_OUTCOMES = [
  "reached",
  "voicemail",
  "no_answer",
  "wrong_number",
] as const;

export type CallOutcome = (typeof CALL_OUTCOMES)[number];

export const TASK_TYPES = ["email", "call", "other"] as const;
export type TaskType = (typeof TASK_TYPES)[number];

export type LeadNote = {
  id: string;
  body: string;
  createdAt: string;
  author?: string;
};

export type LeadCall = {
  id: string;
  outcome: CallOutcome;
  note?: string;
  createdAt: string;
  author?: string;
};

export type LeadTask = {
  id: string;
  type: TaskType;
  title: string;
  dueAt: string;
  remindAt?: string;
  done: boolean;
  doneAt?: string;
  createdAt: string;
};

export type LeadUtm = {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
  ref?: string;
};

export type LeadActivity =
  | { kind: "note"; id: string; at: string; body: string; author?: string }
  | {
      kind: "call";
      id: string;
      at: string;
      outcome: CallOutcome;
      note?: string;
      author?: string;
    }
  | {
      kind: "task";
      id: string;
      at: string;
      title: string;
      type: TaskType;
      dueAt: string;
      done: boolean;
      doneAt?: string;
    }
  | { kind: "email"; at: string; label: string };

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  vertical: string;
  inquiryType: InquiryType;
  start: string;
  meetLink: string | null;
  calendarEventId: string | null;
  htmlLink: string | null;
  status: LeadStatus;
  assignee: string;
  source: LeadSource;
  sourceDetail?: string;
  facebookGroup?: string;
  tawkChatId?: string;
  chatTranscript?: string;
  quoteAmount?: number;
  lostReason?: string;
  notes: LeadNote[];
  calls: LeadCall[];
  tasks: LeadTask[];
  utm?: LeadUtm;
  createdAt: string;
  updatedAt: string;
};

export type LeadSummary = Pick<
  Lead,
  | "id"
  | "name"
  | "email"
  | "phone"
  | "companyName"
  | "vertical"
  | "inquiryType"
  | "start"
  | "status"
  | "assignee"
  | "source"
  | "sourceDetail"
  | "createdAt"
  | "updatedAt"
> & {
  overdueTasks: number;
  openTasks: number;
};

export const FOLLOW_UP_TEMPLATES = [
  {
    id: "post_demo_thanks",
    label: "Post-demo thanks",
    subject: "Thanks for the Hostora demo — next steps",
  },
  {
    id: "quote_nudge",
    label: "Quote nudge",
    subject: "Hostora package quote — ready when you are",
  },
  {
    id: "no_show_reschedule",
    label: "No-show reschedule",
    subject: "Missed you on the Hostora demo — let's reschedule",
  },
] as const;

export type FollowUpTemplateId = (typeof FOLLOW_UP_TEMPLATES)[number]["id"];

export function leadSourceLabel(source: LeadSource): string {
  const labels: Record<LeadSource, string> = {
    website: "Website demo",
    facebook_group: "Facebook group",
    tawk_chat: "Tawk chat",
    referral: "Referral",
    cold_call: "Cold call",
    whatsapp: "WhatsApp",
    other: "Other",
  };
  return labels[source];
}

export function inquiryTypeLabel(type: InquiryType): string {
  return type === "hospitality" ? "Hostora hospitality" : "Business IT";
}

const IT_VERTICAL_SET = new Set<string>(IT_VERTICALS);

/** Backfill inquiry type for leads created before the field existed. */
export function resolveInquiryType(
  lead: Partial<Pick<Lead, "inquiryType" | "vertical">>,
): InquiryType {
  if (lead.inquiryType) return lead.inquiryType;
  if (lead.vertical && IT_VERTICAL_SET.has(lead.vertical)) return "it_services";
  return "hospitality";
}
