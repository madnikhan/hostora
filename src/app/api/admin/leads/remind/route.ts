import { NextResponse } from "next/server";
import { sendStaffReminderDigest } from "@/lib/leads/email";
import { listDueReminders } from "@/lib/leads/store";
import { adminSigningSecret } from "@/lib/seo/adminSession";

/**
 * Auth: Authorization Bearer CRON_SECRET (preferred) or ADMIN signing secret.
 * Vercel Cron automatically sends Bearer CRON_SECRET when that env is set.
 */
function authorize(request: Request): boolean {
  const auth = request.headers.get("authorization") || "";
  const bearer = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!bearer) return false;

  const cronSecret = process.env.CRON_SECRET?.trim();
  if (cronSecret && bearer === cronSecret) return true;

  const adminSecret = adminSigningSecret();
  if (adminSecret && bearer === adminSecret) return true;

  return false;
}

async function handle(request: Request) {
  if (!authorize(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const due = await listDueReminders();
    const emailsSent = await sendStaffReminderDigest(due);
    return NextResponse.json({
      ok: true,
      dueCount: due.length,
      emailsSent,
    });
  } catch (err) {
    console.error("leads remind failed", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Reminder job failed",
      },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  return handle(request);
}

export async function POST(request: Request) {
  return handle(request);
}
