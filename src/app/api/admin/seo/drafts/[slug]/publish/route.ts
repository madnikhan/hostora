import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { saveBlogPost, blogStorageMode } from "@/lib/blog/store";
import { brandLint } from "@/lib/seo/brandLint";
import {
  deleteDraft,
  getDraft,
  loadTopics,
  saveTopics,
} from "@/lib/seo/adminStore";

type Ctx = { params: Promise<{ slug: string }> };

export async function POST(_request: Request, ctx: Ctx) {
  if (blogStorageMode() !== "blob") {
    return NextResponse.json(
      {
        error:
          "Live publish requires Vercel Blob. Set BLOB_READ_WRITE_TOKEN on Production and redeploy. Confirm with GET /api/blog/publish → storage:\"blob\".",
        storage: blogStorageMode(),
      },
      { status: 503 },
    );
  }

  const { slug } = await ctx.params;
  const draft = await getDraft(slug);
  if (!draft) {
    return NextResponse.json({ error: "Draft not found" }, { status: 404 });
  }

  const lint = brandLint(draft);
  if (!lint.ok) {
    return NextResponse.json(
      { error: "Brand lint failed — fix before publish", lintErrors: lint.errors },
      { status: 422 },
    );
  }

  const post = await saveBlogPost({
    slug: draft.slug,
    title: draft.title,
    description: draft.description,
    body: draft.body,
    coverImage: draft.coverImage ?? null,
    publishedAt: new Date().toISOString(),
    source: "hostora",
  });

  await deleteDraft(slug);

  const topics = await loadTopics();
  const nextTopics = topics.map((t) => {
    if (
      t.id === draft.topicId ||
      t.draftSlug === slug ||
      t.draftSlug === draft.slug
    ) {
      return {
        ...t,
        status: "published" as const,
        draftSlug: undefined,
        publishedSlug: post.slug,
      };
    }
    return t;
  });
  await saveTopics(nextTopics);

  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/sitemap.xml");

  return NextResponse.json({ ok: true, post });
}
