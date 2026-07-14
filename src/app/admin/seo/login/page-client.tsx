"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminSeoLoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/admin/seo";
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/seo/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      router.replace(next.startsWith("/admin/seo") ? next : "/admin/seo");
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm pt-16">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-[#E8A54B]">
        Hostora
      </h1>
      <p className="mt-2 text-sm text-white/60">SEO admin · password required</p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <label className="block text-sm text-white/70">
          Password
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border border-white/15 bg-black/40 px-3 py-2 text-[#F4F1EA] outline-none focus:border-[#E8A54B]"
            required
          />
        </label>
        {error ? (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={busy}
          className="w-full bg-[#E8A54B] px-4 py-2.5 text-sm font-medium text-[#0B0B0C] disabled:opacity-50"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
