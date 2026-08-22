"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { DEMO_VERTICALS, type DemoVertical } from "@/lib/demoVerticals";
import {
  INQUIRY_TYPES,
  IT_VERTICALS,
  type InquiryType,
  type ItVertical,
} from "@/lib/leads/types";

type Slot = { start: string; label: string };

type BookingVertical = DemoVertical | ItVertical;

const QUOTE_PACK_HREF = "/sales/Hostora-Quote-Pack.pdf";

const inputClass =
  "mt-2 w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-foreground outline-none focus:border-accent";

const INQUIRY_OPTIONS: {
  value: InquiryType;
  label: string;
  hint: string;
}[] = [
  {
    value: "hospitality",
    label: "Hostora demo",
    hint: "Restaurant, takeaway, events, hotel F&B, or food cart floor ops.",
  },
  {
    value: "it_services",
    label: "Business IT & install",
    hint: "Corporate, NHS site, motor office, or home office hardware and support.",
  },
];

export function DemoBookingForm({
  defaultInquiryType = "hospitality",
}: {
  defaultInquiryType?: InquiryType;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [inquiryType, setInquiryType] = useState<InquiryType>(
    INQUIRY_TYPES.includes(defaultInquiryType)
      ? defaultInquiryType
      : "hospitality",
  );
  const [vertical, setVertical] = useState<BookingVertical | "">("");
  const [date, setDate] = useState("");
  const [dates, setDates] = useState<string[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedStart, setSelectedStart] = useState("");
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [utm, setUtm] = useState<{
    source?: string;
    medium?: string;
    campaign?: string;
    content?: string;
    term?: string;
    ref?: string;
  }>({});
  const [success, setSuccess] = useState<{
    meetLink: string | null;
    start: string;
    emailsSent: boolean;
    emailError: string | null;
    leadId: string | null;
    leadError: string | null;
  } | null>(null);
  const [pending, startTransition] = useTransition();

  const isIt = inquiryType === "it_services";
  const verticalOptions = isIt ? IT_VERTICALS : DEMO_VERTICALS;

  const minDate = dates[0] ?? "";
  const maxDate = dates[dates.length - 1] ?? "";

  const dateSet = useMemo(() => new Set(dates), [dates]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    const next = {
      source: sp.get("utm_source") || undefined,
      medium: sp.get("utm_medium") || undefined,
      campaign: sp.get("utm_campaign") || undefined,
      content: sp.get("utm_content") || undefined,
      term: sp.get("utm_term") || undefined,
      ref: sp.get("ref") || undefined,
    };
    if (Object.values(next).some(Boolean)) setUtm(next);

    const inquiryParam = sp.get("inquiry")?.toLowerCase();
    if (inquiryParam === "it" || inquiryParam === "it_services") {
      setInquiryType("it_services");
    }
  }, []);

  useEffect(() => {
    setVertical("");
  }, [inquiryType]);

  useEffect(() => {
    const probe = new Date().toISOString().slice(0, 10);
    void fetch(`/api/booking/slots?date=${probe}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.dates) && data.dates.length) {
          setDates(data.dates);
          setDate(data.dates[0]);
        }
        if (data.demoMode) setDemoMode(true);
      })
      .catch(() => {
        setError("Could not load booking calendar.");
      });
  }, []);

  useEffect(() => {
    if (!date) return;
    setSlotsLoading(true);
    setSelectedStart("");
    setError(null);
    void fetch(`/api/booking/slots?date=${date}`)
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || "Failed to load slots");
        setSlots(data.slots ?? []);
        if (Array.isArray(data.dates)) setDates(data.dates);
        if (typeof data.demoMode === "boolean") setDemoMode(data.demoMode);
      })
      .catch((e: Error) => {
        setSlots([]);
        setError(e.message);
      })
      .finally(() => setSlotsLoading(false));
  }, [date]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!vertical) {
      setError(
        isIt
          ? "Please select your site or business type."
          : "Please select your business type.",
      );
      return;
    }
    if (!selectedStart) {
      setError("Please select a time slot.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/booking/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            companyName,
            phone,
            inquiryType,
            vertical,
            start: selectedStart,
            ...(Object.values(utm).some(Boolean) ? { utm } : {}),
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Booking failed");
        setSuccess({
          meetLink: data.meetLink ?? null,
          start: data.start,
          emailsSent: Boolean(data.emailsSent),
          emailError: data.emailError ?? null,
          leadId: data.leadId ?? null,
          leadError: data.leadError ?? null,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Booking failed");
      }
    });
  }

  if (success) {
    return (
      <div className="rounded-[2rem] border border-border bg-surface p-8">
        <p className="eyebrow">Confirmed</p>
        <h2 className="display mt-3 text-2xl font-bold">
          {success.emailsSent
            ? "Check your email for confirmation."
            : isIt
              ? "Your call is booked on the calendar."
              : "Your demo is booked on the calendar."}
        </h2>
        <p className="mt-4 text-muted leading-relaxed">
          {success.emailsSent
            ? isIt
              ? "Your 30-minute call with our IT team is booked. We also notified sales."
              : "Your Hostora demo is booked. We also notified our sales team."
            : "The calendar invite was saved, but confirmation emails could not be sent. Our team will follow up — or email sales@hostorasoft.co.uk."}
        </p>
        {success.emailError ? (
          <p className="mt-3 text-sm text-red-400">{success.emailError}</p>
        ) : null}
        {success.leadError ? (
          <p className="mt-3 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            Booking is on the calendar, but the CRM lead was not saved. Staff:
            set <code className="text-amber-50">BLOB_READ_WRITE_TOKEN</code> on
            Vercel and redeploy. ({success.leadError})
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-3">
          {success.meetLink ? (
            <a
              href={success.meetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background"
            >
              Open Google Meet
            </a>
          ) : (
            <p className="text-sm text-muted">
              If a Meet link isn&apos;t available yet, sales will send it
              shortly.
            </p>
          )}
          {!isIt ? (
            <a
              href={QUOTE_PACK_HREF}
              download
              className="inline-flex rounded-full border border-border px-6 py-3 text-sm font-semibold transition hover:border-foreground/30"
            >
              Download your quote pack
            </a>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[2rem] border border-border bg-surface p-8"
    >
      {demoMode ? (
        <p className="mb-5 rounded-xl border border-border bg-surface-2 px-4 py-3 text-xs text-muted">
          Calendar credentials are not configured on this server yet — times
          show as open placeholders. Connect Google Calendar + SMTP to enable
          live booking.
        </p>
      ) : null}

      <fieldset>
        <legend className="text-sm text-muted">What are you enquiring about?</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {INQUIRY_OPTIONS.map((o) => {
            const active = inquiryType === o.value;
            return (
              <button
                key={o.value}
                type="button"
                onClick={() => setInquiryType(o.value)}
                className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                  active
                    ? "border-accent bg-accent/10 text-foreground"
                    : "border-border bg-surface-2 text-foreground hover:border-foreground/30"
                }`}
              >
                <span className="font-semibold">{o.label}</span>
                <span className="mt-1 block text-xs text-muted">{o.hint}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <label className="mt-5 block text-sm text-muted">
        Name
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
          className={inputClass}
          autoComplete="name"
        />
      </label>

      <label className="mt-5 block text-sm text-muted">
        Email
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className={inputClass}
          autoComplete="email"
        />
      </label>

      <label className="mt-5 block text-sm text-muted">
        {isIt ? "Organisation / site" : "Company"}
        <input
          required
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder={isIt ? "Office, site, or dealership name" : "Venue or company name"}
          className={inputClass}
          autoComplete="organization"
        />
      </label>

      <label className="mt-5 block text-sm text-muted">
        Phone
        <input
          required
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+44 …"
          className={inputClass}
          autoComplete="tel"
        />
      </label>

      <fieldset className="mt-5">
        <legend className="text-sm text-muted">
          {isIt ? "Site or business type" : "Business type"}
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {verticalOptions.map((v) => {
            const active = vertical === v;
            return (
              <button
                key={v}
                type="button"
                onClick={() => setVertical(v)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  active
                    ? "border-accent bg-accent text-background"
                    : "border-border bg-surface-2 text-foreground hover:border-foreground/30"
                }`}
              >
                {v}
              </button>
            );
          })}
        </div>
      </fieldset>

      <label className="mt-5 block text-sm text-muted">
        Date
        <input
          required
          type="date"
          value={date}
          min={minDate}
          max={maxDate}
          onChange={(e) => {
            const v = e.target.value;
            if (dateSet.size && !dateSet.has(v)) {
              setError("Please choose a weekday within the next 30 days.");
              return;
            }
            setDate(v);
          }}
          className={inputClass}
        />
      </label>

      <div className="mt-5">
        <p className="text-sm text-muted">Available times (UK)</p>
        {slotsLoading ? (
          <p className="mt-3 text-sm text-muted">Loading slots…</p>
        ) : slots.length === 0 ? (
          <p className="mt-3 text-sm text-muted">
            No open slots this day. Try another date.
          </p>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {slots.map((s) => {
              const active = selectedStart === s.start;
              return (
                <button
                  key={s.start}
                  type="button"
                  onClick={() => setSelectedStart(s.start)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    active
                      ? "border-accent bg-accent text-background"
                      : "border-border bg-surface-2 text-foreground hover:border-foreground/30"
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {error ? (
        <p className="mt-5 text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending || !selectedStart || !vertical}
        className="mt-6 w-full rounded-full bg-accent py-3.5 text-sm font-semibold text-background transition hover:bg-accent-strong disabled:opacity-40"
      >
        {pending
          ? "Booking…"
          : isIt
            ? "Confirm call"
            : "Confirm demo"}
      </button>

      <p className="mt-4 text-xs leading-relaxed text-muted">
        {isIt
          ? "Calls are 30 minutes on Google Meet. Describe your site setup in the confirmation email if helpful."
          : "Demos are 30 minutes on Google Meet. You'll get a confirmation email with the join link."}
      </p>
    </form>
  );
}
