import { addMinutes } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import {
  format,
  isWeekend,
  parse,
  startOfDay,
  addDays,
} from "date-fns";
import { bookingConfig } from "@/lib/booking/config";

export type BusyRange = { start: Date; end: Date };

export type Slot = {
  start: string;
  label: string;
};

function parseHm(dateStr: string, hm: string, timeZone: string): Date {
  const local = parse(`${dateStr} ${hm}`, "yyyy-MM-dd HH:mm", new Date(0));
  return fromZonedTime(local, timeZone);
}

function overlaps(aStart: Date, aEnd: Date, busy: BusyRange[]): boolean {
  return busy.some((b) => aStart < b.end && aEnd > b.start);
}

/** Candidate slots for a calendar date (yyyy-MM-dd) in booking timezone. */
export function buildDaySlots(
  dateStr: string,
  busy: BusyRange[],
  now = new Date(),
): Slot[] {
  const {
    timezone,
    durationMinutes,
    hoursStart,
    hoursEnd,
    weekdaysOnly,
    minLeadHours,
  } = bookingConfig;

  const zonedNow = toZonedTime(now, timezone);
  const dayLocal = parse(dateStr, "yyyy-MM-dd", zonedNow);

  if (Number.isNaN(dayLocal.getTime())) return [];
  if (weekdaysOnly && isWeekend(dayLocal)) return [];

  const dayStart = parseHm(dateStr, hoursStart, timezone);
  const dayEnd = parseHm(dateStr, hoursEnd, timezone);
  const earliest = addMinutes(now, minLeadHours * 60);

  const slots: Slot[] = [];
  let cursor = dayStart;

  while (addMinutes(cursor, durationMinutes) <= dayEnd) {
    const end = addMinutes(cursor, durationMinutes);
    if (cursor >= earliest && !overlaps(cursor, end, busy)) {
      slots.push({
        start: cursor.toISOString(),
        label: format(toZonedTime(cursor, timezone), "HH:mm"),
      });
    }
    cursor = addMinutes(cursor, durationMinutes);
  }

  return slots;
}

export function listBookableDates(now = new Date()): string[] {
  const { timezone, horizonDays, weekdaysOnly } = bookingConfig;
  const zoned = toZonedTime(now, timezone);
  const dates: string[] = [];
  for (let i = 0; i <= horizonDays; i++) {
    const d = addDays(startOfDay(zoned), i);
    if (weekdaysOnly && isWeekend(d)) continue;
    dates.push(format(d, "yyyy-MM-dd"));
  }
  return dates;
}

export function dayBoundsUtc(dateStr: string): { start: Date; end: Date } {
  const { timezone, hoursStart, hoursEnd } = bookingConfig;
  return {
    start: parseHm(dateStr, hoursStart, timezone),
    end: parseHm(dateStr, hoursEnd, timezone),
  };
}
