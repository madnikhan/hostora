"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminButton } from "@/components/admin/AdminButton";
import { LEAD_SOURCES } from "@/lib/leads/types";

export function ManualLeadForm({ team }: { team: string[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    vertical: "Restaurant",
    source: "facebook_group" as (typeof LEAD_SOURCES)[number],
    sourceDetail: "",
    assignee: team[0] ?? "",
    note: "",
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = (await res.json()) as {
        lead?: { id: string };
        error?: string;
        duplicateId?: string;
      };
      if (res.status === 409 && json.duplicateId) {
        setError(`Duplicate email — see existing lead.`);
        router.push(`/admin/leads/${json.duplicateId}`);
        return;
      }
      if (!res.ok) {
        setError(json.error || "Failed to create lead");
        return;
      }
      if (json.lead?.id) router.push(`/admin/leads/${json.lead.id}`);
    } catch {
      setError("Network error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={(e) => void submit(e)}
      className="space-y-3 border border-white/10 bg-[#141416] p-4"
    >
      <p className="text-sm font-medium text-white/80">Add lead manually</p>
      {error ? (
        <p className="text-sm text-red-200">{error}</p>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          required
          placeholder="Company / venue"
          value={form.companyName}
          onChange={(e) => setForm({ ...form, companyName: e.target.value })}
          className="border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-[#E8A54B]"
        />
        <input
          required
          placeholder="Contact name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-[#E8A54B]"
        />
        <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-[#E8A54B]"
        />
        <input
          required
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-[#E8A54B]"
        />
        <select
          value={form.vertical}
          onChange={(e) => setForm({ ...form, vertical: e.target.value })}
          className="border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-[#E8A54B]"
        >
          {["Restaurant", "Takeaway", "Events", "Hotel F&B", "Food cart", "Other"].map(
            (v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ),
          )}
        </select>
        <select
          value={form.source}
          onChange={(e) =>
            setForm({
              ...form,
              source: e.target.value as (typeof LEAD_SOURCES)[number],
            })
          }
          className="border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-[#E8A54B]"
        >
          {LEAD_SOURCES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          placeholder="Source detail (FB group name, etc.)"
          value={form.sourceDetail}
          onChange={(e) => setForm({ ...form, sourceDetail: e.target.value })}
          className="border border-white/15 bg-black/40 px-3 py-2 text-sm sm:col-span-2 outline-none focus:border-[#E8A54B]"
        />
        <select
          value={form.assignee}
          onChange={(e) => setForm({ ...form, assignee: e.target.value })}
          className="border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-[#E8A54B]"
        >
          {team.map((email) => (
            <option key={email} value={email}>
              {email}
            </option>
          ))}
        </select>
        <textarea
          placeholder="Initial note (optional)"
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          rows={2}
          className="border border-white/15 bg-black/40 px-3 py-2 text-sm sm:col-span-2 outline-none focus:border-[#E8A54B]"
        />
      </div>
      <AdminButton type="submit" disabled={busy}>
        {busy ? "Saving…" : "Create lead"}
      </AdminButton>
    </form>
  );
}
