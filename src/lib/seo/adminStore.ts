import { del, head, list, put } from "@vercel/blob";
import { promises as fs } from "node:fs";
import path from "node:path";
import seedTopics from "../../../content/seo/topics.json";
import { blogStorageMode } from "@/lib/blog/store";
import { slugify } from "@/lib/blog/types";

export type SeoTopic = {
  id: string;
  keyword: string;
  angle: string;
  vertical: string;
  status: "queued" | "drafted" | "published";
  priority: number;
  draftSlug?: string;
  publishedSlug?: string;
};

export type SeoDraft = {
  slug: string;
  title: string;
  description: string;
  body: string;
  coverImage?: string | null;
  status: "draft";
  source: "hostora";
  topicId?: string;
  keyword?: string;
  createdAt: string;
  updatedAt?: string;
};

const TOPICS_BLOB = "seo/topics.json";
const DRAFT_PREFIX = "blog/drafts/";

function hasBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function putJson(pathname: string, data: unknown) {
  if (!hasBlob()) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is not set. Add it on Vercel Production and redeploy.",
    );
  }
  await put(pathname, JSON.stringify(data, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

async function readJsonBlob<T>(pathname: string): Promise<T | null> {
  if (!hasBlob()) return null;
  try {
    const meta = await head(pathname);
    const res = await fetch(meta.url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function loadTopics(): Promise<SeoTopic[]> {
  const fromBlob = await readJsonBlob<SeoTopic[]>(TOPICS_BLOB);
  if (fromBlob?.length) return fromBlob;
  return (seedTopics as SeoTopic[]).map((t) => ({ ...t }));
}

export async function saveTopics(topics: SeoTopic[]): Promise<void> {
  if (hasBlob()) {
    await putJson(TOPICS_BLOB, topics);
    return;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is not set. Add it on Vercel Production and redeploy.",
    );
  }
  const file = path.join(process.cwd(), "content", "seo", "topics.json");
  await fs.writeFile(file, `${JSON.stringify(topics, null, 2)}\n`, "utf8");
}

export async function listDrafts(): Promise<SeoDraft[]> {
  if (!hasBlob()) {
    // Local fallback: content/blog/drafts
    const dir = path.join(process.cwd(), "content", "blog", "drafts");
    try {
      const files = await fs.readdir(dir);
      const drafts: SeoDraft[] = [];
      for (const file of files) {
        if (!file.endsWith(".json")) continue;
        const raw = await fs.readFile(path.join(dir, file), "utf8");
        drafts.push(JSON.parse(raw) as SeoDraft);
      }
      return drafts;
    } catch {
      return [];
    }
  }
  const { blobs } = await list({ prefix: DRAFT_PREFIX });
  const drafts: SeoDraft[] = [];
  for (const blob of blobs) {
    if (!blob.pathname.endsWith(".json")) continue;
    const res = await fetch(blob.url, { cache: "no-store" });
    if (!res.ok) continue;
    drafts.push((await res.json()) as SeoDraft);
  }
  return drafts.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function getDraft(slug: string): Promise<SeoDraft | null> {
  const clean = slugify(slug);
  if (hasBlob()) {
    return readJsonBlob<SeoDraft>(`${DRAFT_PREFIX}${clean}.json`);
  }
  try {
    const raw = await fs.readFile(
      path.join(process.cwd(), "content", "blog", "drafts", `${clean}.json`),
      "utf8",
    );
    return JSON.parse(raw) as SeoDraft;
  } catch {
    return null;
  }
}

export async function saveDraft(draft: SeoDraft): Promise<SeoDraft> {
  const slug = slugify(draft.slug);
  const next: SeoDraft = {
    ...draft,
    slug,
    status: "draft",
    source: "hostora",
    updatedAt: new Date().toISOString(),
  };
  if (hasBlob()) {
    await putJson(`${DRAFT_PREFIX}${slug}.json`, next);
    return next;
  }
  const dir = path.join(process.cwd(), "content", "blog", "drafts");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(
    path.join(dir, `${slug}.json`),
    JSON.stringify(next, null, 2),
    "utf8",
  );
  return next;
}

export async function deleteDraft(slug: string): Promise<void> {
  const clean = slugify(slug);
  if (hasBlob()) {
    try {
      const meta = await head(`${DRAFT_PREFIX}${clean}.json`);
      await del(meta.url);
    } catch {
      /* not found */
    }
    return;
  }
  try {
    await fs.unlink(
      path.join(process.cwd(), "content", "blog", "drafts", `${clean}.json`),
    );
  } catch {
    /* ignore */
  }
}

export function seoStorageStatus() {
  return {
    mode: blogStorageMode(),
    canPublishLive: blogStorageMode() === "blob",
    canWriteDraftsOnServer: hasBlob() || process.env.NODE_ENV !== "production",
  };
}
