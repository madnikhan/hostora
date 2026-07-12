import { NextResponse } from "next/server";
import { addMinutes } from "date-fns";
import { z } from "zod";
import { bookingConfig, isGoogleConfigured } from "@/lib/booking/config";
import { sendBookingEmails } from "@/lib/booking/email";
import { createMeetEvent, getBusyRanges } from "@/lib/booking/google";
import { rateLimit } from "@/lib/booking/rateLimit";
import { buildDaySlots } from "@/lib/booking/slots";

const bodySchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  companyName: z.string().trim().min(2).max(200),
  phone: z
    .string()
    .trim()
    .min(7)
    .max(40)
    .regex(/^[+\d\s().-]+$/),
  start: z.string().datetime(),
});

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const limited = rateLimit(`book:${ip}`, 8, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many booking attempts. Please wait a minute." },
      { status: 429 },
    );
  }

  if (!isGoogleConfigured()) {
    return NextResponse.json(
      {
        error:
          "Booking is not configured yet. Add Google Calendar credentials on the server.",
      },
      { status: 503 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check name, email, company, phone, and time slot." },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const start = new Date(data.start);
  if (Number.isNaN(start.getTime())) {
    return NextResponse.json({ error: "Invalid start time" }, { status: 400 });
  }

  // Re-validate slot is still free
  try {
    const { formatInTimeZone } = await import("date-fns-tz");
    const localDate = formatInTimeZone(
      start,
      bookingConfig.timezone,
      "yyyy-MM-dd",
    );
    const busy = await getBusyRanges(
      addMinutes(start, -bookingConfig.durationMinutes),
      addMinutes(start, bookingConfig.durationMinutes * 2),
    );
    const open = buildDaySlots(localDate, busy);
    const ok = open.some(
      (s) => Math.abs(new Date(s.start).getTime() - start.getTime()) < 1000,
    );
    if (!ok) {
      return NextResponse.json(
        { error: "That time is no longer available. Pick another slot." },
        { status: 409 },
      );
    }
  } catch (err) {
    console.error("slot recheck failed", err);
    const message =
      err instanceof Error && err.message.includes("not accessible")
        ? err.message
        : "Could not verify availability. Check that GOOGLE_CALENDAR_ID is shared with the service account.";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  let meeting;
  try {
    meeting = await createMeetEvent({
      summary: `Hostora demo — ${data.companyName}`,
      description: [
        `Hostora product demo`,
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `Company: ${data.companyName}`,
        `Phone: ${data.phone}`,
      ].join("\n"),
      start,
      attendeeEmail: data.email,
      attendeeName: data.name,
    });
  } catch (err) {
    console.error("booking create failed", err);
    const gErr = err as {
      code?: number;
      message?: string;
      response?: { status?: number; data?: { error?: { message?: string } } };
    };
    const status = gErr.response?.status ?? gErr.code;
    const googleMsg = gErr.response?.data?.error?.message || gErr.message;
    if (status === 404) {
      return NextResponse.json(
        {
          error:
            "Calendar not found. Share GOOGLE_CALENDAR_ID with the service account (Make changes to events), or use the calendar ID from Google Calendar → Settings.",
        },
        { status: 502 },
      );
    }
    if (status === 403) {
      return NextResponse.json(
        {
          error:
            "Calendar permission denied. Share the calendar with the service account as Make changes to events.",
        },
        { status: 502 },
      );
    }
    return NextResponse.json(
      {
        error:
          googleMsg ||
          "Could not create the booking. Please try again or email sales.",
      },
      { status: 502 },
    );
  }

  try {
    await sendBookingEmails({
      name: data.name,
      email: data.email,
      companyName: data.companyName,
      phone: data.phone,
      start,
      meetLink: meeting.meetLink ?? null,
      htmlLink: meeting.htmlLink ?? null,
    });
  } catch (err) {
    console.error("booking emails failed (event was created)", err);
  }

  return NextResponse.json({
    ok: true,
    meetLink: meeting.meetLink,
    start: meeting.start,
    htmlLink: meeting.htmlLink,
  });
}
