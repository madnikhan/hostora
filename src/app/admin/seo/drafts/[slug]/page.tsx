"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useState } from "react";

type Draft = {
  slug: string;
  title: string;
  description: string;
  body: string;
  coverImage?: string | null;
  keyword?: string;
};

export default function DraftEditorPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [lintErrors, setLintErrors] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [canPublish, setCanPublish] = useState(false);

  const load = useCallback(async () => {
    setError("");
    const [draftRes, statusRes] = await Promise.all([
      fetch(`/api/admin/seo/drafts/${slug}`),
      fetch("/api/admin/seo/status"),
    ]);
    if (draftRes.status === 401) {
      router.replace("/admin/seo/login");
      return;
    }
    const statusJson = (await statusRes.json()) as {
      storage?: { canPublishLive?: boolean };
    };
    setCanPublish(Boolean(statusJson.storage?.canPublishLive));

    const json = (await draftRes.json()) as {
      draft?: Draft;
      lint?: { errors: string[] };
      error?: string;
    };
    if (!draftRes.ok) {
      setError(json.error || "Draft not found");
      return;
    }
    setDraft(json.draft!);
    setLintErrors(json.lint?.errors || []);
  }, [slug, router]);

  useEffect(() => {
    void load();
  }, [load]);

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!draft) return;
    setBusy(true);
    setMsg("");
    setError("");
    try {
      const res = await fetch(`/api/admin/seo/drafts/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: draft.title,
          description: draft.description,
          body: draft.body,
          coverImage: draft.coverImage ?? null,
        }),
      });
      const json = (await res.json()) as {
        draft?: Draft;
        lint?: { errors: string[] };
        error?: string;
      };
      if (!res.ok) {
        setError(json.error || "Save failed");
        return;
      }
      setDraft(json.draft!);
      setLintErrors(json.lint?.errors || []);
      setMsg("Saved");
    } catch {
      setError("Network error");
    } finally {
      setBusy(false);
    }
  }

  async function onPublish() {
    if (!draft || !canPublish) return;
    if (!confirm(`Publish “${draft.title}” live to /blog/${draft.slug}?`)) {
      return;
    }
    setBusy(true);
    setError("");
    setMsg("");
    try {
      const res = await fetch(`/api/admin/seo/drafts/${slug}/publish`, {
        method: "POST",
      });
      const json = (await res.json()) as {
        error?: string;
        lintErrors?: string[];
        post?: { slug: string };
      };
      if (!res.ok) {
        setError(
          json.error ||
            (json.lintErrors ? json.lintErrors.join("; ") : "Publish failed"),
        );
        if (json.lintErrors) setLintErrors(json.lintErrors);
        return;
      }
      setMsg("Published");
      router.push(`/blog/${json.post?.slug || draft.slug}`);
    } catch {
      setError("Network error");
    } finally {
      setBusy(false);
    }
  }

  async function onDiscard() {
    if (!confirm("Discard this draft and return the topic to the queue?")) {
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/seo/drafts/${slug}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const json = (await res.json()) as { error?: string };
        setError(json.error || "Discard failed");
        return;
      }
      router.push("/admin/seo");
    } catch {
      setError("Network error");
    } finally {
      setBusy(false);
    }
  }

  if (!draft && !error) {
    return <p className="text-white/50">Loading draft…</p>;
  }

  if (!draft) {
    return (
      <div>
        <p className="text-red-400">{error}</p>
        <Link href="/admin/seo" className="mt-4 inline-block text-[#E8A54B]">
          ← Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin/seo" className="text-sm text-white/50 hover:text-white/80">
          ← Dashboard
        </Link>
        <p className="text-xs text-white/40">{draft.slug}</p>
      </div>

      <h1 className="font-[family-name:var(--font-display)] text-2xl text-[#E8A54B]">
        Edit draft
      </h1>

      {!canPublish ? (
        <div className="border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          Publish disabled — Blob not configured on this environment.
        </div>
      ) : null}

      {lintErrors.length > 0 ? (
        <ul className="border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {lintErrors.map((e) => (
            <li key={e}>· {e}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-emerald-400">Brand lint OK</p>
      )}

      {error ? (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}
      {msg ? <p className="text-sm text-emerald-400">{msg}</p> : null}

      <form onSubmit={onSave} className="space-y-4">
        <label className="block text-sm text-white/70">
          Title
          <input
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            className="mt-1 w-full border border-white/15 bg-black/40 px-3 py-2 outline-none focus:border-[#E8A54B]"
          />
        </label>
        <label className="block text-sm text-white/70">
          Description
          <textarea
            value={draft.description}
            onChange={(e) =>
              setDraft({ ...draft, description: e.target.value })
            }
            rows={2}
            className="mt-1 w-full border border-white/15 bg-black/40 px-3 py-2 outline-none focus:border-[#E8A54B]"
          />
        </label>
        <label className="block text-sm text-white/70">
          Body (HTML)
          <textarea
            value={draft.body}
            onChange={(e) => setDraft({ ...draft, body: e.target.value })}
            rows={22}
            className="mt-1 w-full border border-white/15 bg-black/40 px-3 py-2 font-mono text-xs leading-relaxed outline-none focus:border-[#E8A54B]"
          />
        </label>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            disabled={busy}
            className="bg-[#E8A54B] px-4 py-2 text-sm font-medium text-[#0B0B0C] disabled:opacity-40"
          >
            {busy ? "Working…" : "Save draft"}
          </button>
          <button
            type="button"
            disabled={busy || !canPublish || lintErrors.length > 0}
            onClick={() => void onPublish()}
            className="border border-[#E8A54B] px-4 py-2 text-sm text-[#E8A54B] disabled:opacity-40"
          >
            Publish live
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void onDiscard()}
            className="border border-white/20 px-4 py-2 text-sm text-white/55 hover:text-white/80 disabled:opacity-40"
          >
            Discard
          </button>
        </div>
      </form>
    </div>
  );
}
