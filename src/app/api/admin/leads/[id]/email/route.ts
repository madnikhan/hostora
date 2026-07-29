import { NextResponse } from "next/server";
import { z } from "zod";
import { sendLeadFollowUpEmail } from "@/lib/leads/email";
import { addLeadNote, getLead } from "@/lib/leads/store";
import { FOLLOW_UP_TEMPLATES } from "@/lib/leads/types";
import { isAdminAuthenticated } from "@/lib/seo/adminAuth";

type Ctx = { params: Promise<{ id: string }> };

const schema = z.object({
  templateId: z.enum([
    FOLLOW_UP_TEMPLATES[0].id,
    FOLLOW_UP_TEMPLATES[1].id,
    FOLLOW_UP_TEMPLATES[2].id,
  ]),
});

export async function POST(request: Request, ctx: Ctx) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const lead = await getLead(id);
  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid template" }, { status: 400 });
  }

  try {
    await sendLeadFollowUpEmail(lead, parsed.data.templateId);
    const label =
      FOLLOW_UP_TEMPLATES.find((t) => t.id === parsed.data.templateId)
        ?.label || parsed.data.templateId;
    const updated = await addLeadNote(
      id,
      `Sent follow-up email: ${label}`,
    );
    return NextResponse.json({ ok: true, lead: updated });
  } catch (err) {
    console.error("follow-up email failed", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Could not send follow-up email",
      },
      { status: 502 },
    );
  }
}
