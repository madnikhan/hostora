import { addMinutes } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { bookingConfig } from "@/lib/booking/config";

function escapeIcs(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function formatIcsUtc(d: Date): string {
  return formatInTimeZone(d, "UTC", "yyyyMMdd'T'HHmmss'Z'");
}

export function buildDemoIcs(input: {
  start: Date;
  summary: string;
  description: string;
  meetLink?: string | null;
  attendeeEmail?: string;
}): string {
  const tz = bookingConfig.timezone;
  const end = addMinutes(input.start, bookingConfig.durationMinutes);
  const uid = `hostora-${input.start.getTime()}@hostorasoft.co.uk`;
  const stamp = formatIcsUtc(new Date());
  const dtStart = formatInTimeZone(input.start, tz, "yyyyMMdd'T'HHmmss");
  const dtEnd = formatInTimeZone(end, tz, "yyyyMMdd'T'HHmmss");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//K WAZIR LTD//Hostora Booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART;TZID=${tz}:${dtStart}`,
    `DTEND;TZID=${tz}:${dtEnd}`,
    `SUMMARY:${escapeIcs(input.summary)}`,
    `DESCRIPTION:${escapeIcs(input.description)}`,
  ];

  if (input.meetLink) {
    lines.push(`URL:${input.meetLink}`);
    lines.push(`LOCATION:${escapeIcs(input.meetLink)}`);
  }
  if (input.attendeeEmail) {
    lines.push(
      `ATTENDEE;CN=${escapeIcs(input.attendeeEmail)};RSVP=TRUE:mailto:${input.attendeeEmail}`,
    );
  }

  lines.push("END:VEVENT", "END:VCALENDAR");
  return `${lines.join("\r\n")}\r\n`;
}
