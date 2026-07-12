import { google } from "googleapis";
import { addMinutes } from "date-fns";
import { bookingConfig } from "@/lib/booking/config";
import type { BusyRange } from "@/lib/booking/slots";

function calendarClient() {
  const { googleClientEmail, googlePrivateKey } = bookingConfig;
  if (!googleClientEmail || !googlePrivateKey) {
    throw new Error("Google Calendar credentials are not configured");
  }

  const auth = new google.auth.JWT({
    email: googleClientEmail,
    key: googlePrivateKey,
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });

  return google.calendar({ version: "v3", auth });
}

export async function getBusyRanges(
  timeMin: Date,
  timeMax: Date,
): Promise<BusyRange[]> {
  if (!bookingConfig.googleCalendarId) {
    return [];
  }

  const calendar = calendarClient();
  const res = await calendar.freebusy.query({
    requestBody: {
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      timeZone: bookingConfig.timezone,
      items: [{ id: bookingConfig.googleCalendarId }],
    },
  });

  const cal = res.data.calendars?.[bookingConfig.googleCalendarId];
  const calErrors = cal?.errors;
  if (calErrors?.length) {
    const reason = calErrors.map((e) => e.reason || "unknown").join(", ");
    throw new Error(
      `Calendar "${bookingConfig.googleCalendarId}" is not accessible (${reason}). Share it with the service account as Make changes to events, or set GOOGLE_CALENDAR_ID to the calendar ID from Google Calendar settings.`,
    );
  }

  const busy = cal?.busy ?? [];

  return busy
    .filter((b) => b.start && b.end)
    .map((b) => ({
      start: new Date(b.start as string),
      end: new Date(b.end as string),
    }));
}

export type CreatedMeeting = {
  eventId: string;
  htmlLink?: string | null;
  meetLink?: string | null;
  start: string;
  end: string;
};

export async function createMeetEvent(input: {
  summary: string;
  description: string;
  start: Date;
  attendeeEmail: string;
  attendeeName: string;
}): Promise<CreatedMeeting> {
  const calendar = calendarClient();
  const end = addMinutes(input.start, bookingConfig.durationMinutes);
  const requestId = `hostora-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  // Service accounts cannot invite attendees without Domain-Wide Delegation —
  // put guest details in the description; confirmation goes out via SMTP.
  const description = [
    `Guest: ${input.attendeeName} <${input.attendeeEmail}>`,
    input.description,
  ].join("\n");

  const timeBody = {
    start: {
      dateTime: input.start.toISOString(),
      timeZone: bookingConfig.timezone,
    },
    end: {
      dateTime: end.toISOString(),
      timeZone: bookingConfig.timezone,
    },
  };

  try {
    const res = await calendar.events.insert({
      calendarId: bookingConfig.googleCalendarId,
      conferenceDataVersion: 1,
      sendUpdates: "none",
      requestBody: {
        summary: input.summary,
        description,
        ...timeBody,
        conferenceData: {
          createRequest: {
            requestId,
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
      },
    });

    const meetLink =
      res.data.hangoutLink ||
      res.data.conferenceData?.entryPoints?.find(
        (e) => e.entryPointType === "video",
      )?.uri ||
      null;

    return {
      eventId: res.data.id || requestId,
      htmlLink: res.data.htmlLink,
      meetLink,
      start: input.start.toISOString(),
      end: end.toISOString(),
    };
  } catch (err) {
    const status = (err as { code?: number; response?: { status?: number } })
      ?.response?.status ?? (err as { code?: number }).code;
    // Missing calendar / bad credentials — plain insert will fail the same way
    if (status === 404 || status === 401) {
      throw err;
    }

    // Fallback: create event without Meet (consumer Gmail / missing Workspace)
    console.warn("Meet conference failed; creating event without Meet", err);
    const res = await calendar.events.insert({
      calendarId: bookingConfig.googleCalendarId,
      sendUpdates: "none",
      requestBody: {
        summary: input.summary,
        description: `${description}\n\n(Google Meet link could not be auto-created — sales will send a link shortly.)`,
        ...timeBody,
      },
    });

    return {
      eventId: res.data.id || requestId,
      htmlLink: res.data.htmlLink,
      meetLink: null,
      start: input.start.toISOString(),
      end: end.toISOString(),
    };
  }
}
