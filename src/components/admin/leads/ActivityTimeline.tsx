"use client";

import type { LeadActivity } from "@/lib/leads/types";

export function ActivityTimeline({ items }: { items: LeadActivity[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-white/35">No activity yet.</p>;
  }
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          key={`${item.kind}-${item.kind === "email" ? item.at : item.id}`}
          className="border-b border-white/5 pb-3 text-sm"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-white/10 px-2 py-0.5 text-xs uppercase tracking-wide text-white/70">
              {item.kind}
            </span>
            <span className="text-xs text-white/35">
              {new Date(item.at).toLocaleString("en-GB")}
            </span>
          </div>
          {item.kind === "note" ? (
            <p className="mt-2 whitespace-pre-wrap text-white/80">{item.body}</p>
          ) : null}
          {item.kind === "call" ? (
            <p className="mt-2 text-white/80">
              {item.outcome}
              {item.note ? ` — ${item.note}` : ""}
            </p>
          ) : null}
          {item.kind === "task" ? (
            <p
              className={`mt-2 ${item.done ? "text-white/40 line-through" : "text-white/80"}`}
            >
              [{item.type}] {item.title}
            </p>
          ) : null}
          {item.kind === "email" ? (
            <p className="mt-2 text-white/80">{item.label}</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
