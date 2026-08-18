"use client";

import { LEAD_SOURCES, leadSourceLabel, type LeadSource } from "@/lib/leads/types";

const ASSIGNEE_KEY = "hostora_sales_assignee";

export function getStoredAssignee(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(ASSIGNEE_KEY) || "";
}

export function setStoredAssignee(email: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ASSIGNEE_KEY, email);
}

export function AssigneePicker({
  team,
  value,
  onChange,
}: {
  team: string[];
  value: string;
  onChange: (email: string) => void;
}) {
  return (
    <label className="block text-sm text-white/60">
      Working as
      <select
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setStoredAssignee(e.target.value);
        }}
        className="mt-1 block w-full border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-[#E8A54B]"
      >
        <option value="">All team</option>
        {team.map((email) => (
          <option key={email} value={email}>
            {email}
          </option>
        ))}
      </select>
    </label>
  );
}

export function SourceBadge({ source }: { source: LeadSource }) {
  return (
    <span className="rounded bg-white/10 px-2 py-0.5 text-xs text-white/75">
      {leadSourceLabel(source)}
    </span>
  );
}

export { LEAD_SOURCES };
