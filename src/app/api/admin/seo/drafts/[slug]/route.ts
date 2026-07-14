import { NextResponse } from "next/server";
import { z } from "zod";
import { brandLint } from "@/lib/seo/brandLint";
import {
  deleteDraft,
  getDraft,
  loadTopics,
  saveDraft,
  saveTopics,
} from "@/lib/seo/adminStore";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  const { slug } = await ctx.params;
  const draft = await getDraft(slug);
  if (!draft) {
    return NextResponse.json({ error: "Draft not found" }, { status: 404 });
  }
  const lint = brandLint(draft);
  return NextResponse.json({ draft, lint });
}

const putSchema = z.object({
  title: z.string().trim().min(3).max(200),
  description: z.string().trim().max(500),
  body: z.string().min(1),
  coverImage: z.string().url().nullable().optional(),
});

export async function PUT(request: Request, ctx: Ctx) {
  const { slug } = await ctx.params;
  const existing = await getDraft(slug);
  if (!existing) {
    return NextResponse.json({ error: "Draft not found" }, { status: 404 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = putSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid draft", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const next = await saveDraft({
    ...existing,
    title: parsed.data.title,
    description: parsed.data.description,
    body: parsed.data.body,
    coverImage: parsed.data.coverImage ?? existing.coverImage ?? null,
  });
  const lint = brandLint(next);
  return NextResponse.json({ draft: next, lint });
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const { slug } = await ctx.params;
  const existing = await getDraft(slug);
  if (!existing) {
    return NextResponse.json({ error: "Draft not found" }, { status: 404 });
  }

  await deleteDraft(slug);

  const topics = await loadTopics();
  const nextTopics = topics.map((t) => {
    if (t.draftSlug === slug || t.id === existing.topicId) {
      if (t.status === "drafted") {
        return {
          ...t,
          status: "queued" as const,
          draftSlug: undefined,
        };
      }
    }
    return t;
  });
  try {
    await saveTopics(nextTopics);
  } catch {
    /* blob may be missing locally after delete */
  }

  return NextResponse.json({ ok: true });
}
