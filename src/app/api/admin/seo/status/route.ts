import { NextResponse } from "next/server";
import {
  listDrafts,
  loadTopics,
  seoStorageStatus,
} from "@/lib/seo/adminStore";

export async function GET() {
  const [topics, drafts, storage] = await Promise.all([
    loadTopics(),
    listDrafts(),
    Promise.resolve(seoStorageStatus()),
  ]);

  const counts = {
    queued: topics.filter((t) => t.status === "queued").length,
    drafted: topics.filter((t) => t.status === "drafted").length,
    published: topics.filter((t) => t.status === "published").length,
  };

  return NextResponse.json({
    storage,
    counts,
    topics,
    drafts: drafts.map((d) => ({
      slug: d.slug,
      title: d.title,
      keyword: d.keyword,
      topicId: d.topicId,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    })),
    llmConfigured: Boolean(
      process.env.SEO_LLM_API_KEY?.trim() ||
        process.env.OPENAI_API_KEY?.trim(),
    ),
  });
}
