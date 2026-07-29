import { NextResponse } from "next/server";
import { z } from "zod";
import {
  addLeadCall,
  addLeadNote,
  addLeadTask,
  completeLeadTask,
  getLead,
  updateLeadAssignee,
  updateLeadStatus,
} from "@/lib/leads/store";
import {
  CALL_OUTCOMES,
  LEAD_STATUSES,
  TASK_TYPES,
} from "@/lib/leads/types";
import { isAdminAuthenticated } from "@/lib/seo/adminAuth";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const lead = await getLead(id);
  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }
  return NextResponse.json({ lead });
}

const patchSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("status"),
    status: z.enum(LEAD_STATUSES),
  }),
  z.object({
    action: z.literal("assignee"),
    assignee: z.string().trim().email().max(200),
  }),
  z.object({
    action: z.literal("note"),
    body: z.string().trim().min(1).max(4000),
  }),
  z.object({
    action: z.literal("call"),
    outcome: z.enum(CALL_OUTCOMES),
    note: z.string().trim().max(2000).optional(),
  }),
  z.object({
    action: z.literal("task"),
    type: z.enum(TASK_TYPES),
    title: z.string().trim().min(2).max(200),
    dueAt: z.string().datetime(),
    remindAt: z.string().datetime().optional(),
  }),
  z.object({
    action: z.literal("complete_task"),
    taskId: z.string().trim().min(1),
  }),
]);

export async function PATCH(request: Request, ctx: Ctx) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid patch payload" }, { status: 400 });
  }

  const data = parsed.data;
  let lead = null;
  switch (data.action) {
    case "status":
      lead = await updateLeadStatus(id, data.status);
      break;
    case "assignee":
      lead = await updateLeadAssignee(id, data.assignee);
      break;
    case "note":
      lead = await addLeadNote(id, data.body);
      break;
    case "call":
      lead = await addLeadCall(id, data.outcome, data.note);
      break;
    case "task":
      lead = await addLeadTask(id, {
        type: data.type,
        title: data.title,
        dueAt: data.dueAt,
        remindAt: data.remindAt,
      });
      break;
    case "complete_task":
      lead = await completeLeadTask(id, data.taskId);
      break;
  }

  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }
  return NextResponse.json({ lead });
}
