import { NextResponse } from "next/server";
import { listLeadSummaries, leadsStorageMode } from "@/lib/leads/store";
import { isAdminAuthenticated } from "@/lib/seo/adminAuth";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const leads = await listLeadSummaries();
    return NextResponse.json({
      storage: leadsStorageMode(),
      leads,
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
