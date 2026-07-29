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

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  vertical: string;
  start: string;
  meetLink: string | null;
  calendarEventId: string | null;
  htmlLink: string | null;
  status: LeadStatus;
  assignee: string;
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
  | "start"
  | "status"
  | "assignee"
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
