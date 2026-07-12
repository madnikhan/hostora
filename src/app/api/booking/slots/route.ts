import { NextResponse } from "next/server";
import { addMinutes } from "date-fns";
import { z } from "zod";
import { bookingConfig, isGoogleConfigured } from "@/lib/booking/config";
import { getBusyRanges } from "@/lib/booking/google";
import { buildDaySlots, dayBoundsUtc, listBookableDates } from "@/lib/booking/slots";
import { rateLimit } from "@/lib/booking/rateLimit";

const querySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function GET(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const limited = rateLimit(`slots:${ip}`, 60, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } },
    );
  }

  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({ date: searchParams.get("date") });
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  const { date } = parsed.data;
  const allowed = listBookableDates();
  if (!allowed.includes(date)) {
    return NextResponse.json({ slots: [], dates: allowed });
  }

  let busy: { start: Date; end: Date }[] = [];
  if (isGoogleConfigured()) {
    try {
      const bounds = dayBoundsUtc(date);
      busy = await getBusyRanges(
        addMinutes(bounds.start, -30),
        addMinutes(bounds.end, 30),
      );
    } catch (err) {
      console.error("freeBusy failed", {
        calendarId: bookingConfig.googleCalendarId,
        err,
      });
      const message =
        err instanceof Error && err.message.includes("not accessible")
          ? err.message
          : "Could not load availability. Check GOOGLE_CALENDAR_ID is shared with the service account.";
      return NextResponse.json({ error: message }, { status: 502 });
    }
  }

  const slots = buildDaySlots(date, busy);
  return NextResponse.json({ slots, dates: allowed, demoMode: !isGoogleConfigured() });
}
