import { company } from "@/lib/company";

function env(name: string, fallback = ""): string {
  return (process.env[name] ?? fallback).trim();
}

function parseHours(raw: string): { start: string; end: string } {
  const [start, end] = raw.split("-").map((s) => s.trim());
  return { start: start || "09:00", end: end || "17:00" };
}

/** Accept raw calendar IDs or Google Calendar embed/share URLs. */
export function normalizeGoogleCalendarId(raw: string): string {
  const value = raw.trim();
  if (!value) return "";

  try {
    if (value.includes("://") || value.includes("calendar.google.com")) {
      const url = new URL(
        value.startsWith("http") ? value : `https://${value.replace(/^\/+/, "")}`,
      );
      const src = url.searchParams.get("src");
      if (src) return decodeURIComponent(src).trim();
    }
  } catch {
    // fall through
  }

  const srcMatch = value.match(/[?&]src=([^&]+)/i);
  if (srcMatch?.[1]) {
    try {
      return decodeURIComponent(srcMatch[1]).trim();
    } catch {
      return srcMatch[1].trim();
    }
  }

  return value;
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
  fromEmail: env("BOOKING_FROM_EMAIL", `Hostora <${company.email}>`),
  smtpHost: env("SMTP_HOST", "smtp.ionos.co.uk"),
  smtpPort: Number(env("SMTP_PORT", "587")) || 587,
  smtpUser: env("SMTP_USER", company.email),
  smtpPass: env("SMTP_PASS"),
  googleCalendarId: normalizeGoogleCalendarId(env("GOOGLE_CALENDAR_ID")),
  googleClientEmail: env("GOOGLE_SERVICE_ACCOUNT_EMAIL"),
  googlePrivateKey: env("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY").replace(
    /\\n/g,
    "\n",
  ),
};

export function isSmtpConfigured(): boolean {
  return Boolean(
    bookingConfig.smtpHost &&
      bookingConfig.smtpUser &&
      bookingConfig.smtpPass,
  );
}

export function isBookingConfigured(): boolean {
  return Boolean(
    bookingConfig.googleCalendarId &&
      bookingConfig.googleClientEmail &&
      bookingConfig.googlePrivateKey &&
      isSmtpConfigured(),
  );
}

export function isGoogleConfigured(): boolean {
  return Boolean(
    bookingConfig.googleCalendarId &&
      bookingConfig.googleClientEmail &&
      bookingConfig.googlePrivateKey,
  );
}
