import { NextResponse } from "next/server";
import { z } from "zod";
import { leadsToCsv } from "@/lib/leads/activities";
import { computeLeadStats } from "@/lib/leads/stats";
import {
  createManualLead,
  findLeadByEmail,
  listLeadSummaries,
  listLeads,
  leadsStorageMode,
} from "@/lib/leads/store";
import { getSalesTeam } from "@/lib/leads/team";
import { LEAD_SOURCES, INQUIRY_TYPES } from "@/lib/leads/types";
import { isAdminAuthenticated } from "@/lib/seo/adminAuth";

const createSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(3).max(40),
  companyName: z.string().trim().min(1).max(200),
  vertical: z.string().trim().min(1).max(100),
  inquiryType: z.enum(INQUIRY_TYPES).optional(),
  source: z.enum(LEAD_SOURCES),
  sourceDetail: z.string().trim().max(500).optional(),
  facebookGroup: z.string().trim().max(200).optional(),
  assignee: z.string().trim().email().max(200).optional(),
  start: z.string().datetime().optional(),
  note: z.string().trim().max(4000).optional(),
});

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format");

    if (format === "csv") {
      const leads = await listLeads();
      const csv = leadsToCsv(leads);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": 'attachment; filename="hostora-leads.csv"',
        },
      });
    }

    const leads = await listLeadSummaries();
    const full = await listLeads();
    const stats = computeLeadStats(full);
    return NextResponse.json({
      storage: leadsStorageMode(),
      leads,
      stats,
      team: getSalesTeam(),
      counts: {
        total: leads.length,
        new: leads.filter((l) => l.status === "new").length,
        overdueTasks: leads.reduce((n, l) => n + l.overdueTasks, 0),
      },
    });
  } catch (err) {
    console.error("list leads failed", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to list leads" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid lead payload" }, { status: 400 });
  }

  const data = parsed.data;
  const duplicate = await findLeadByEmail(data.email);
  if (duplicate) {
    return NextResponse.json(
      {
        error: "A lead with this email already exists",
        duplicateId: duplicate.id,
      },
      { status: 409 },
    );
  }

  try {
    const lead = await createManualLead(data);
    return NextResponse.json({ lead }, { status: 201 });
  } catch (err) {
    console.error("create lead failed", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create lead" },
      { status: 500 },
    );
  }
}
