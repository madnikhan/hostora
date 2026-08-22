"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  CALL_OUTCOMES,
  FOLLOW_UP_TEMPLATES,
  LEAD_STATUSES,
  TASK_TYPES,
  leadSourceLabel,
  type FollowUpTemplateId,
  type Lead,
  type LeadActivity,
  type LeadStatus,
} from "@/lib/leads/types";
import { ActivityTimeline } from "@/components/admin/leads/ActivityTimeline";
import { InquiryTypeBadge, SourceBadge } from "@/components/admin/leads/AssigneePicker";
import { AdminButton } from "@/components/admin/AdminButton";

function waLink(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}`;
}

export default function AdminLeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [team, setTeam] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const [callOutcome, setCallOutcome] =
    useState<(typeof CALL_OUTCOMES)[number]>("reached");
  const [callNote, setCallNote] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskType, setTaskType] =
    useState<(typeof TASK_TYPES)[number]>("call");
  const [taskDue, setTaskDue] = useState("");
  const [templateId, setTemplateId] = useState<FollowUpTemplateId>(
    "post_demo_thanks",
  );

  const load = useCallback(async () => {
    setError("");
    try {
      const res = await fetch(`/api/admin/leads/${id}`);
      if (res.status === 401) {
        router.replace(`/admin/seo/login?next=/admin/leads/${id}`);
        return;
      }
      const json = (await res.json()) as {
        lead?: Lead;
        activities?: LeadActivity[];
        error?: string;
      };
      if (!res.ok) {
        setError(json.error || "Failed to load");
        return;
      }
      setLead(json.lead || null);
      setActivities(json.activities || []);
    } catch {
      setError("Network error");
    }
  }, [id, router]);

  useEffect(() => {
    void load();
    void fetch("/api/admin/leads")
      .then((r) => r.json())
      .then((j: { team?: string[] }) => setTeam(j.team || []))
      .catch(() => {});
  }, [load]);

  async function patch(body: Record<string, unknown>) {
    setBusy(true);
    setMsg("");
    setError("");
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as {
        lead?: Lead;
        activities?: LeadActivity[];
        error?: string;
      };
      if (!res.ok) {
        setError(json.error || "Update failed");
        return;
      }
      setLead(json.lead || null);
      setActivities(json.activities || []);
      setMsg("Saved");
    } catch {
      setError("Network error");
    } finally {
      setBusy(false);
    }
  }

  async function sendEmail() {
    setBusy(true);
    setMsg("");
    setError("");
    try {
      const res = await fetch(`/api/admin/leads/${id}/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId }),
      });
      const json = (await res.json()) as { lead?: Lead; error?: string };
      if (!res.ok) {
        setError(json.error || "Send failed");
        return;
      }
      setLead(json.lead || null);
      setMsg("Follow-up email sent");
    } catch {
      setError("Network error");
    } finally {
      setBusy(false);
    }
  }

  if (!lead && !error) {
    return <p className="text-sm text-white/50">Loading…</p>;
  }
  if (!lead) {
    return (
      <p className="text-sm text-red-200">{error || "Lead not found"}</p>
    );
  }

  const whatsapp = waLink(lead.phone);

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/leads"
          className="text-sm text-white/50 hover:text-white/80"
        >
          ← All leads
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">
          {lead.companyName}
        </h1>
        <p className="mt-1 text-white/55">
          {lead.name} · {lead.vertical} ·{" "}
          <InquiryTypeBadge type={lead.inquiryType} /> ·{" "}
          <SourceBadge source={lead.source} />
        </p>
        {lead.sourceDetail ? (
          <p className="mt-1 text-sm text-white/45">{lead.sourceDetail}</p>
        ) : null}
        {msg ? (
          <p className="mt-2 text-sm text-[#E8A54B]">{msg}</p>
        ) : null}
        {error ? (
          <p className="mt-2 text-sm text-red-200">{error}</p>
        ) : null}
      </div>

      <section className="grid gap-4 border border-white/10 p-4 sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-white/40">
            Contact
          </p>
          <div className="mt-2 space-y-1 text-sm">
            <p>
              <a className="text-[#E8A54B] hover:underline" href={`mailto:${lead.email}`}>
                {lead.email}
              </a>
            </p>
            <p>
              <a className="text-[#E8A54B] hover:underline" href={`tel:${lead.phone}`}>
                {lead.phone}
              </a>
              {whatsapp ? (
                <>
                  {" · "}
                  <a
                    className="text-[#E8A54B] hover:underline"
                    href={whatsapp}
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp
                  </a>
                </>
              ) : null}
            </p>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-white/40">Demo</p>
          <p className="mt-2 text-sm text-white/80">
            {new Date(lead.start).toLocaleString("en-GB", {
              dateStyle: "full",
              timeStyle: "short",
            })}
          </p>
          <div className="mt-2 flex flex-wrap gap-3 text-sm">
            {lead.meetLink ? (
              <a
                href={lead.meetLink}
                className="text-[#E8A54B] hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                Meet link
              </a>
            ) : null}
            {lead.htmlLink ? (
              <a
                href={lead.htmlLink}
                className="text-[#E8A54B] hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                Calendar event
              </a>
            ) : null}
          </div>
        </div>
        <div>
          <label className="text-xs uppercase tracking-wide text-white/40">
            Status
          </label>
          <select
            value={lead.status}
            disabled={busy}
            onChange={(e) =>
              void patch({
                action: "status",
                status: e.target.value as LeadStatus,
              })
            }
            className="mt-2 w-full border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-[#E8A54B]"
          >
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs uppercase tracking-wide text-white/40">
            Assignee
          </label>
          <select
            value={lead.assignee}
            disabled={busy}
            onChange={(e) =>
              void patch({ action: "assignee", assignee: e.target.value })
            }
            className="mt-2 w-full border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-[#E8A54B]"
          >
            {Array.from(
              new Set([...team, lead.assignee.toLowerCase()]),
            ).map((email) => (
              <option key={email} value={email}>
                {email}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs uppercase tracking-wide text-white/40">
            Quote amount (GBP)
          </label>
          <input
            type="number"
            min={0}
            step={1}
            defaultValue={lead.quoteAmount ?? ""}
            disabled={busy}
            onBlur={(e) => {
              const v = e.target.value;
              void patch({
                action: "meta",
                quoteAmount: v ? Number(v) : null,
              });
            }}
            className="mt-2 w-full border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-[#E8A54B]"
          />
        </div>
        {lead.status === "lost" ? (
          <div className="sm:col-span-2">
            <label className="text-xs uppercase tracking-wide text-white/40">
              Lost reason
            </label>
            <input
              defaultValue={lead.lostReason ?? ""}
              disabled={busy}
              onBlur={(e) =>
                void patch({
                  action: "meta",
                  lostReason: e.target.value || null,
                })
              }
              className="mt-2 w-full border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-[#E8A54B]"
            />
          </div>
        ) : null}
        {lead.utm && Object.values(lead.utm).some(Boolean) ? (
          <div className="sm:col-span-2">
            <p className="text-xs uppercase tracking-wide text-white/40">
              Attribution
            </p>
            <p className="mt-2 text-sm text-white/60">
              {[
                lead.utm.source && `source=${lead.utm.source}`,
                lead.utm.medium && `medium=${lead.utm.medium}`,
                lead.utm.campaign && `campaign=${lead.utm.campaign}`,
                lead.utm.ref && `ref=${lead.utm.ref}`,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
        ) : null}
      </section>

      <section className="border border-white/10 p-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-white/45">
          Activity timeline
        </h2>
        <div className="mt-4">
          <ActivityTimeline items={activities} />
        </div>
      </section>

      <section className="border border-white/10 p-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-white/45">
          Log call
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <select
            value={callOutcome}
            onChange={(e) =>
              setCallOutcome(e.target.value as (typeof CALL_OUTCOMES)[number])
            }
            className="border border-white/15 bg-black/40 px-3 py-2 text-sm"
          >
            {CALL_OUTCOMES.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <input
            value={callNote}
            onChange={(e) => setCallNote(e.target.value)}
            placeholder="Optional note"
            className="min-w-[12rem] flex-1 border border-white/15 bg-black/40 px-3 py-2 text-sm"
          />
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              void patch({
                action: "call",
                outcome: callOutcome,
                note: callNote || undefined,
              }).then(() => setCallNote(""));
            }}
            className="bg-[#E8A54B] px-4 py-2 text-sm font-medium text-[#0B0B0C] disabled:opacity-40"
          >
            Save call
          </button>
        </div>
        <ul className="mt-4 space-y-2 text-sm text-white/65">
          {lead.calls.map((c) => (
            <li key={c.id} className="border-b border-white/5 pb-2">
              <span className="text-white/90">{c.outcome}</span>
              {c.note ? ` — ${c.note}` : ""}
              <span className="ml-2 text-xs text-white/35">
                {new Date(c.createdAt).toLocaleString("en-GB")}
              </span>
            </li>
          ))}
          {lead.calls.length === 0 ? (
            <li className="text-white/35">No calls logged yet.</li>
          ) : null}
        </ul>
      </section>

      <section className="border border-white/10 p-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-white/45">
          Follow-up tasks
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <select
            value={taskType}
            onChange={(e) =>
              setTaskType(e.target.value as (typeof TASK_TYPES)[number])
            }
            className="border border-white/15 bg-black/40 px-3 py-2 text-sm"
          >
            {TASK_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <input
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Task title"
            className="min-w-[10rem] flex-1 border border-white/15 bg-black/40 px-3 py-2 text-sm"
          />
          <input
            type="datetime-local"
            value={taskDue}
            onChange={(e) => setTaskDue(e.target.value)}
            className="border border-white/15 bg-black/40 px-3 py-2 text-sm"
          />
          <button
            type="button"
            disabled={busy || !taskTitle || !taskDue}
            onClick={() => {
              const dueAt = new Date(taskDue).toISOString();
              void patch({
                action: "task",
                type: taskType,
                title: taskTitle,
                dueAt,
                remindAt: dueAt,
              }).then(() => {
                setTaskTitle("");
                setTaskDue("");
              });
            }}
            className="bg-[#E8A54B] px-4 py-2 text-sm font-medium text-[#0B0B0C] disabled:opacity-40"
          >
            Add task
          </button>
        </div>
        <ul className="mt-4 space-y-2 text-sm">
          {lead.tasks.map((t) => {
            const overdue =
              !t.done && new Date(t.dueAt).getTime() < Date.now();
            return (
              <li
                key={t.id}
                className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2"
              >
                <div>
                  <span
                    className={
                      t.done
                        ? "text-white/40 line-through"
                        : overdue
                          ? "text-amber-300"
                          : "text-white/85"
                    }
                  >
                    [{t.type}] {t.title}
                  </span>
                  <p className="text-xs text-white/40">
                    Due{" "}
                    {new Date(t.dueAt).toLocaleString("en-GB", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
                {!t.done ? (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      void patch({
                        action: "complete_task",
                        taskId: t.id,
                      })
                    }
                    className="text-xs text-[#E8A54B] hover:underline"
                  >
                    Mark done
                  </button>
                ) : null}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="border border-white/10 p-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-white/45">
          Send follow-up email
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <select
            value={templateId}
            onChange={(e) =>
              setTemplateId(e.target.value as FollowUpTemplateId)
            }
            className="border border-white/15 bg-black/40 px-3 py-2 text-sm"
          >
            {FOLLOW_UP_TEMPLATES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={busy}
            onClick={() => void sendEmail()}
            className="bg-[#E8A54B] px-4 py-2 text-sm font-medium text-[#0B0B0C] disabled:opacity-40"
          >
            Send to {lead.email}
          </button>
        </div>
      </section>

      <section className="border border-white/10 p-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-white/45">
          Notes
        </h2>
        <div className="mt-3 flex gap-2">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Internal note…"
            className="flex-1 border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-[#E8A54B]"
          />
          <button
            type="button"
            disabled={busy || !note.trim()}
            onClick={() => {
              void patch({ action: "note", body: note }).then(() =>
                setNote(""),
              );
            }}
            className="self-start bg-[#E8A54B] px-4 py-2 text-sm font-medium text-[#0B0B0C] disabled:opacity-40"
          >
            Add
          </button>
        </div>
        <ul className="mt-4 space-y-3 text-sm text-white/65">
          {lead.notes.map((n) => (
            <li key={n.id} className="border-b border-white/5 pb-2">
              <p className="whitespace-pre-wrap text-white/85">{n.body}</p>
              <p className="mt-1 text-xs text-white/35">
                {new Date(n.createdAt).toLocaleString("en-GB")}
              </p>
            </li>
          ))}
          {lead.notes.length === 0 ? (
            <li className="text-white/35">No notes yet.</li>
          ) : null}
        </ul>
      </section>
    </div>
  );
}
