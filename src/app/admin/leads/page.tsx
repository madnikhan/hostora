"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/leads/types";

type LeadRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  vertical: string;
  start: string;
  status: LeadStatus;
  assignee: string;
  createdAt: string;
  updatedAt: string;
  overdueTasks: number;
  openTasks: number;
};

export default function AdminLeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [overdueOnly, setOverdueOnly] = useState(false);

  const load = useCallback(async () => {
    setError("");
    try {
      const res = await fetch("/api/admin/leads");
      if (res.status === 401) {
        router.replace("/admin/seo/login?next=/admin/leads");
        return;
      }
      const json = (await res.json()) as {
        leads?: LeadRow[];
        error?: string;
      };
      if (!res.ok) {
        setError(json.error || "Failed to load leads");
        return;
      }
      setLeads(json.leads || []);
    } catch {
      setError("Network error");
    }
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return leads.filter((l) => {
      if (status !== "all" && l.status !== status) return false;
      if (overdueOnly && l.overdueTasks < 1) return false;
      if (!needle) return true;
      return (
        l.name.toLowerCase().includes(needle) ||
        l.email.toLowerCase().includes(needle) ||
        l.companyName.toLowerCase().includes(needle) ||
        l.phone.includes(needle)
      );
    });
  }, [leads, q, status, overdueOnly]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-white/45">
            CRM
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Demo leads
          </h1>
          <p className="mt-2 max-w-xl text-sm text-white/55">
            Every Book a demo request lands here — pipeline, calls, and
            follow-ups.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded border border-white/15 px-3 py-1.5 text-sm text-white/70 hover:border-white/30"
        >
          Refresh
        </button>
      </div>

      {error ? (
        <p className="mt-4 border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {error}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, email, company…"
          className="min-w-[14rem] flex-1 border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-[#E8A54B]"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-[#E8A54B]"
        >
          <option value="all">All statuses</option>
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm text-white/60">
          <input
            type="checkbox"
            checked={overdueOnly}
            onChange={(e) => setOverdueOnly(e.target.checked)}
          />
          Overdue tasks
        </label>
      </div>

      <div className="mt-6 overflow-x-auto border border-white/10">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-white/10 text-white/45">
            <tr>
              <th className="px-3 py-2 font-medium">Lead</th>
              <th className="px-3 py-2 font-medium">Vertical</th>
              <th className="px-3 py-2 font-medium">Demo</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Tasks</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-8 text-center text-white/40"
                >
                  No leads yet. New bookings from /contact appear here.
                </td>
              </tr>
            ) : (
              filtered.map((l) => (
                <tr
                  key={l.id}
                  className="border-b border-white/5 hover:bg-white/[0.03]"
                >
                  <td className="px-3 py-3">
                    <Link
                      href={`/admin/leads/${l.id}`}
                      className="font-medium text-[#E8A54B] hover:underline"
                    >
                      {l.companyName}
                    </Link>
                    <p className="text-white/55">
                      {l.name} · {l.email}
                    </p>
                  </td>
                  <td className="px-3 py-3 text-white/70">{l.vertical}</td>
                  <td className="px-3 py-3 text-white/70">
                    {new Date(l.start).toLocaleString("en-GB", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-3 py-3">
                    <span className="rounded bg-white/10 px-2 py-0.5 text-xs uppercase tracking-wide text-white/80">
                      {l.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-white/70">
                    {l.openTasks}
                    {l.overdueTasks > 0 ? (
                      <span className="ml-2 text-xs text-amber-300">
                        {l.overdueTasks} overdue
                      </span>
                    ) : null}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
