import { company } from "@/lib/company";

function env(name: string, fallback = ""): string {
  return (process.env[name] ?? fallback).trim();
}

function parseHours(raw: string): { start: string; end: string } {
  const [start, end] = raw.split("-").map((s) => s.trim());
  return { start: start || "09:00", end: end || "17:00" };
}

const hours = parseHours(env("BOOKING_HOURS", "09:00-17:00"));

export const bookingConfig = {
  timezone: env("BOOKING_TIMEZONE", "Europe/London"),
  durationMinutes: Number(env("BOOKING_DURATION_MINUTES", "30")) || 30,
  hoursStart: hours.start,
  hoursEnd: hours.end,
  weekdaysOnly: true,
  horizonDays: 30,
  minLeadHours: 2,
  notifyEmails: env(
    "BOOKING_NOTIFY_EMAILS",
    `${company.email},madnikhan1@gmail.com`,
  )
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean),
  fromEmail: env("BOOKING_FROM_EMAIL", "Hostora Bookings <onboarding@resend.dev>"),
  googleCalendarId: env("GOOGLE_CALENDAR_ID"),
  googleClientEmail: env("GOOGLE_SERVICE_ACCOUNT_EMAIL"),
  googlePrivateKey: env("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY").replace(
    /\\n/g,
    "\n",
  ),
  resendApiKey: env("RESEND_API_KEY"),
};

export function isBookingConfigured(): boolean {
  return Boolean(
    bookingConfig.googleCalendarId &&
      bookingConfig.googleClientEmail &&
      bookingConfig.googlePrivateKey &&
      bookingConfig.resendApiKey,
  );
}

export function isGoogleConfigured(): boolean {
  return Boolean(
    bookingConfig.googleCalendarId &&
      bookingConfig.googleClientEmail &&
      bookingConfig.googlePrivateKey,
  );
}
