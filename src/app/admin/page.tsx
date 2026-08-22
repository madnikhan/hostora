"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AssigneePicker,
  getStoredAssignee,
  InquiryTypeBadge,
  SourceBadge,
} from "@/components/admin/leads/AssigneePicker";
import { AdminButton } from "@/components/admin/AdminButton";
import type { InquiryType, LeadSource, LeadStatus } from "@/lib/leads/types";
import { INQUIRY_TYPES, LEAD_STATUSES, inquiryTypeLabel, leadSourceLabel } from "@/lib/leads/types";

type LeadStats = {
  total: number;
  byStatus: Record<LeadStatus, number>;
  bySource: Record<LeadSource, number>;
  byInquiryType: Record<InquiryType, number>;
  newThisWeek: number;
  demosNext24h: number;
  overdueTasks: number;
  openTasks: number;
};

type LeadRow = {
  id: string;
  name: string;
  companyName: string;
  start: string;
  status: LeadStatus;
  source: LeadSource;
  inquiryType: InquiryType;
  assignee: string;
  meetLink?: string | null;
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [team, setTeam] = useState<string[]>([]);
  const [assignee, setAssignee] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const res = await fetch("/api/admin/leads");
      if (res.status === 401) {
        router.replace("/admin/seo/login?next=/admin");
        return;
      }
      const json = (await res.json()) as {
        stats?: LeadStats;
        leads?: LeadRow[];
        team?: string[];
        error?: string;
      };
      if (!res.ok) {
        setError(json.error || "Failed to load");
        return;
      }
      setStats(json.stats ?? null);
      setLeads(json.leads ?? []);
      setTeam(json.team ?? []);
    } catch {
      setError("Network error");
    }
  }, [router]);

  useEffect(() => {
    setAssignee(getStoredAssignee());
    void load();
  }, [load]);

  const myLeads = useMemo(() => {
    if (!assignee) return leads;
    return leads.filter(
      (l) => l.assignee.toLowerCase() === assignee.toLowerCase(),
    );
  }, [leads, assignee]);

  const demosToday = useMemo(() => {
    const now = Date.now();
    const next24h = now + 24 * 60 * 60 * 1000;
    return myLeads
      .filter((l) => {
        const t = new Date(l.start).getTime();
        return t >= now && t <= next24h;
      })
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  }, [myLeads]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-white/45">
            Sales
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-2 max-w-xl text-sm text-white/55">
            Pipeline overview — demos, sources, and your queue.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <AdminButton variant="secondary" onClick={() => void load()}>
            Refresh
          </AdminButton>
          <Link href="/admin/leads">
            <AdminButton variant="secondary">All leads</AdminButton>
          </Link>
          <Link href="/admin/outreach">
            <AdminButton variant="secondary">Outreach</AdminButton>
          </Link>
        </div>
      </div>

      {error ? (
        <p className="border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {error}
        </p>
      ) : null}

      <div className="max-w-xs">
        <AssigneePicker team={team} value={assignee} onChange={setAssignee} />
      </div>

      {stats ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total leads", value: stats.total },
            { label: "New this week", value: stats.newThisWeek },
            { label: "Demos next 24h", value: stats.demosNext24h },
            { label: "Overdue tasks", value: stats.overdueTasks },
          ].map((c) => (
            <div
              key={c.label}
              className="border border-white/10 bg-[#141416] p-4"
            >
              <p className="text-xs uppercase tracking-wide text-white/40">
                {c.label}
              </p>
              <p className="mt-2 text-3xl font-semibold text-[#E8A54B]">
                {c.value}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {stats ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <section className="border border-white/10 p-4">
            <h2 className="text-sm font-medium uppercase tracking-wide text-white/45">
              Pipeline
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              {LEAD_STATUSES.map((s) => (
                <li key={s} className="flex justify-between text-white/75">
                  <span>{s.replace("_", " ")}</span>
                  <span>{stats.byStatus[s]}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="border border-white/10 p-4">
            <h2 className="text-sm font-medium uppercase tracking-wide text-white/45">
              By source
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              {(Object.keys(stats.bySource) as LeadSource[]).map((s) => (
                <li key={s} className="flex justify-between text-white/75">
                  <span>{leadSourceLabel(s)}</span>
                  <span>{stats.bySource[s]}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="border border-white/10 p-4">
            <h2 className="text-sm font-medium uppercase tracking-wide text-white/45">
              By track
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              {(Object.keys(stats.byInquiryType) as InquiryType[]).map((t) => (
                <li key={t} className="flex justify-between text-white/75">
                  <span>{inquiryTypeLabel(t)}</span>
                  <span>{stats.byInquiryType[t]}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      ) : null}

      <section className="border border-white/10 p-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-white/45">
          Demos in the next 24 hours
          {assignee ? ` · ${assignee}` : ""}
        </h2>
        <ul className="mt-4 space-y-3 text-sm">
          {demosToday.length === 0 ? (
            <li className="text-white/35">No demos scheduled.</li>
          ) : (
            demosToday.map((l) => (
              <li
                key={l.id}
                className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2"
              >
                <div>
                  <Link
                    href={`/admin/leads/${l.id}`}
                    className="font-medium text-[#E8A54B] hover:underline"
                  >
                    {l.companyName}
                  </Link>
                  <p className="text-white/50">
                    {new Date(l.start).toLocaleString("en-GB", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
                <SourceBadge source={l.source} />
                <InquiryTypeBadge type={l.inquiryType} />
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
