import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/booking/rateLimit";
import { brandLint } from "@/lib/seo/brandLint";
import { generateSeoArticle } from "@/lib/seo/generateDraft";
import {
  listDrafts,
  loadTopics,
  saveDraft,
  saveTopics,
  seoStorageStatus,
} from "@/lib/seo/adminStore";

export async function POST(request: Request) {
  const storage = seoStorageStatus();
  if (!storage.canWriteDraftsOnServer) {
    return NextResponse.json(
      {
        error:
          "Cannot write drafts: set BLOB_READ_WRITE_TOKEN on Vercel Production and redeploy.",
        storage,
      },
      { status: 503 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const limited = rateLimit(`seo-admin-draft:${ip}`, 4, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many draft requests", retryAfterSec: limited.retryAfterSec },
      { status: 429 },
    );
  }

  const open = await listDrafts();
  if (open.length > 0) {
    return NextResponse.json(
      {
        error: `A draft already exists (${open[0]!.slug}). Publish or discard it first.`,
        draftSlug: open[0]!.slug,
      },
      { status: 409 },
    );
  }

  const topics = await loadTopics();
  const queued = topics
    .filter((t) => t.status === "queued")
    .sort((a, b) => (b.priority || 0) - (a.priority || 0));
  if (!queued.length) {
    return NextResponse.json(
      { error: "No queued topics" },
      { status: 404 },
    );
  }
  const topic = queued[0]!;

  try {
    const generated = await generateSeoArticle(topic);
    const draft = {
      slug: generated.slug,
      title: generated.title,
      description: generated.description,
      body: generated.html,
      coverImage: null as string | null,
      status: "draft" as const,
      source: "hostora" as const,
      topicId: topic.id,
      keyword: topic.keyword,
      createdAt: new Date().toISOString(),
    };

    const lint = brandLint(draft);
    if (!lint.ok) {
      return NextResponse.json(
        { error: "Brand lint failed", lintErrors: lint.errors, draft },
        { status: 422 },
      );
    }

    const saved = await saveDraft(draft);
    const nextTopics = topics.map((t) =>
      t.id === topic.id
        ? { ...t, status: "drafted" as const, draftSlug: saved.slug }
        : t,
    );
    await saveTopics(nextTopics);

    return NextResponse.json({ ok: true, draft: saved, topicId: topic.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Draft failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
