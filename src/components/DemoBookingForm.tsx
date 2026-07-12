"use client";

import { useEffect, useMemo, useState, useTransition } from "react";

type Slot = { start: string; label: string };

const inputClass =
  "mt-2 w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-foreground outline-none focus:border-accent";

export function DemoBookingForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [dates, setDates] = useState<string[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedStart, setSelectedStart] = useState("");
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    meetLink: string | null;
    start: string;
  } | null>(null);
  const [pending, startTransition] = useTransition();

  const minDate = dates[0] ?? "";
  const maxDate = dates[dates.length - 1] ?? "";

  const dateSet = useMemo(() => new Set(dates), [dates]);

  useEffect(() => {
    // Bootstrap allowed dates from slots API (today's first bookable date query)
    const probe =
      new Date().toISOString().slice(0, 10);
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
            start: selectedStart,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Booking failed");
        setSuccess({ meetLink: data.meetLink ?? null, start: data.start });
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
          Check your email for the Google Meet link.
        </h2>
        <p className="mt-4 text-muted leading-relaxed">
          Your Hostora demo is booked. We also notified our sales team.
        </p>
        {success.meetLink ? (
          <a
            href={success.meetLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background"
          >
            Open Google Meet
          </a>
        ) : (
          <p className="mt-6 text-sm text-muted">
            If the Meet link isn&apos;t in your inbox yet, sales will send it
            shortly.
          </p>
        )}
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
          show as open placeholders. Connect Google Calendar + Resend to enable
          live booking.
        </p>
      ) : null}

      <label className="block text-sm text-muted">
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
        Company
        <input
          required
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Venue or company name"
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
        disabled={pending || !selectedStart}
        className="mt-6 w-full rounded-full bg-accent py-3.5 text-sm font-semibold text-background transition hover:bg-accent-strong disabled:opacity-40"
      >
        {pending ? "Booking…" : "Confirm demo"}
      </button>

      <p className="mt-4 text-xs leading-relaxed text-muted">
        Demos are 30 minutes on Google Meet. You&apos;ll get a confirmation
        email with the join link.
      </p>
    </form>
  );
}
