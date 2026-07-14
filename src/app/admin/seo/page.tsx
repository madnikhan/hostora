"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type StatusPayload = {
  storage: {
    mode: "blob" | "filesystem";
    canPublishLive: boolean;
    canWriteDraftsOnServer: boolean;
  };
  counts: { queued: number; drafted: number; published: number };
  topics: {
    id: string;
    keyword: string;
    angle: string;
    vertical: string;
    status: string;
    priority: number;
    draftSlug?: string;
    publishedSlug?: string;
  }[];
  drafts: {
    slug: string;
    title: string;
    keyword?: string;
    createdAt: string;
  }[];
  llmConfigured: boolean;
};

export default function AdminSeoDashboard() {
  const router = useRouter();
  const [data, setData] = useState<StatusPayload | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const res = await fetch("/api/admin/seo/status");
      if (res.status === 401) {
        router.replace("/admin/seo/login");
        return;
      }
      const json = (await res.json()) as StatusPayload & { error?: string };
      if (!res.ok) {
        setError(json.error || "Failed to load");
        return;
      }
      setData(json);
    } catch {
      setError("Network error");
    }
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  async function logout() {
    await fetch("/api/admin/seo/logout", { method: "POST" });
    router.replace("/admin/seo/login");
  }

  async function generateDraft() {
    setBusy(true);
    setMsg("");
    setError("");
    try {
      const res = await fetch("/api/admin/seo/draft", { method: "POST" });
      const json = (await res.json()) as {
        error?: string;
        draftSlug?: string;
        draft?: { slug: string };
        lintErrors?: string[];
      };
      if (res.status === 409 && json.draftSlug) {
        router.push(`/admin/seo/drafts/${json.draftSlug}`);
        return;
      }
      if (!res.ok) {
        setError(
          json.error ||
            (json.lintErrors ? json.lintErrors.join("; ") : "Generate failed"),
        );
        return;
      }
      if (json.draft?.slug) {
        router.push(`/admin/seo/drafts/${json.draft.slug}`);
        return;
      }
      setMsg("Draft created");
      await load();
    } catch {
      setError("Network error");
    } finally {
      setBusy(false);
    }
  }

  if (!data && !error) {
    return <p className="text-white/50">Loading…</p>;
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-[#E8A54B]">
            SEO console
          </h1>
          <p className="mt-1 text-sm text-white/55">
            Generate, edit, approve, publish to Blob
          </p>
        </div>
        <button
          type="button"
          onClick={() => void logout()}
          className="text-sm text-white/45 hover:text-white/80"
        >
          Log out
        </button>
      </div>

      {data && !data.storage.canPublishLive ? (
        <div
          className="border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100"
          role="status"
        >
          Storage is <code className="text-amber-200">{data.storage.mode}</code>
          . Live publish is disabled until{" "}
          <code className="text-amber-200">BLOB_READ_WRITE_TOKEN</code> is set
          on Vercel Production and you redeploy. Confirm:{" "}
          <code className="text-amber-200">
            GET /api/blog/publish → &quot;storage&quot;:&quot;blob&quot;
          </code>
          .
        </div>
      ) : null}

      {data && !data.llmConfigured ? (
        <div className="border border-white/15 px-4 py-3 text-sm text-white/70">
          <code className="text-[#E8A54B]">SEO_LLM_API_KEY</code> is not set on
          this server — Generate draft will fail until you add it on Vercel.
        </div>
      ) : null}

      {error ? (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}
      {msg ? <p className="text-sm text-emerald-400">{msg}</p> : null}

      {data ? (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={
                data.storage.canPublishLive
                  ? "text-xs uppercase tracking-wide text-emerald-400"
                  : "text-xs uppercase tracking-wide text-amber-400"
              }
            >
              storage · {data.storage.mode}
            </span>
            <span className="text-xs text-white/40">
              queued {data.counts.queued} · drafted {data.counts.drafted} ·
              published {data.counts.published}
            </span>
            <button
              type="button"
              disabled={busy || !data.storage.canWriteDraftsOnServer}
              onClick={() => void generateDraft()}
              className="ml-auto bg-[#E8A54B] px-4 py-2 text-sm font-medium text-[#0B0B0C] disabled:opacity-40"
            >
              {busy ? "Generating…" : "Generate draft"}
            </button>
            <button
              type="button"
              onClick={() => void load()}
              className="border border-white/20 px-3 py-2 text-sm text-white/70 hover:border-white/40"
            >
              Refresh
            </button>
          </div>

          <section>
            <h2 className="text-sm font-medium uppercase tracking-wide text-white/45">
              Open drafts
            </h2>
            {data.drafts.length === 0 ? (
              <p className="mt-3 text-sm text-white/45">No open drafts</p>
            ) : (
              <ul className="mt-3 divide-y divide-white/10 border-t border-white/10">
                {data.drafts.map((d) => (
                  <li key={d.slug} className="flex items-center gap-3 py-3">
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/admin/seo/drafts/${d.slug}`}
                        className="text-[#F4F1EA] hover:text-[#E8A54B]"
                      >
                        {d.title}
                      </Link>
                      <p className="truncate text-xs text-white/40">
                        {d.slug}
                        {d.keyword ? ` · ${d.keyword}` : ""}
                      </p>
                    </div>
                    <Link
                      href={`/admin/seo/drafts/${d.slug}`}
                      className="shrink-0 text-sm text-[#E8A54B]"
                    >
                      Edit
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="text-sm font-medium uppercase tracking-wide text-white/45">
              Topic queue
            </h2>
            <div className="mt-3 overflow-x-auto border-t border-white/10">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wide text-white/40">
                    <th className="py-2 pr-3 font-medium">Pri</th>
                    <th className="py-2 pr-3 font-medium">Status</th>
                    <th className="py-2 pr-3 font-medium">Keyword</th>
                    <th className="py-2 font-medium">Vertical</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {data.topics
                    .slice()
                    .sort((a, b) => (b.priority || 0) - (a.priority || 0))
                    .map((t) => (
                      <tr key={t.id}>
                        <td className="py-2.5 pr-3 tabular-nums text-white/50">
                          {t.priority}
                        </td>
                        <td className="py-2.5 pr-3">
                          <span
                            className={
                              t.status === "queued"
                                ? "text-[#E8A54B]"
                                : t.status === "published"
                                  ? "text-emerald-400"
                                  : "text-white/70"
                            }
                          >
                            {t.status}
                          </span>
                        </td>
                        <td className="py-2.5 pr-3 text-white/85">
                          {t.keyword}
                          {t.draftSlug ? (
                            <Link
                              href={`/admin/seo/drafts/${t.draftSlug}`}
                              className="ml-2 text-xs text-[#E8A54B]"
                            >
                              draft
                            </Link>
                          ) : null}
                          {t.publishedSlug ? (
                            <Link
                              href={`/blog/${t.publishedSlug}`}
                              className="ml-2 text-xs text-white/40 hover:text-white/70"
                            >
                              live
                            </Link>
                          ) : null}
                        </td>
                        <td className="py-2.5 text-white/45">{t.vertical}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}
