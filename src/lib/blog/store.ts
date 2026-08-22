import { head, list, put } from "@vercel/blob";
import { unstable_cache } from "next/cache";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { BlogPost } from "./types";
import { slugify } from "./types";

const SEED_DIR = path.join(process.cwd(), "content", "blog");
const BLOB_PREFIX = "blog/posts/";

function hasBlobToken() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function readSeedPosts(): Promise<BlogPost[]> {
  try {
    const files = await fs.readdir(SEED_DIR);
    const posts: BlogPost[] = [];
    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      const raw = await fs.readFile(path.join(SEED_DIR, file), "utf8");
      const parsed = JSON.parse(raw) as BlogPost;
      if (parsed?.slug && parsed?.title) {
        posts.push({ ...parsed, source: parsed.source ?? "seed" });
      }
    }
    return posts;
  } catch {
    return [];
  }
}

async function readBlobPostByPath(pathname: string): Promise<BlogPost | null> {
  if (!hasBlobToken()) return null;
  try {
    const meta = await head(pathname);
    const res = await fetch(meta.url, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const parsed = (await res.json()) as BlogPost;
    if (parsed?.slug && parsed?.title) {
      return { ...parsed, source: parsed.source ?? "soro" };
    }
    return null;
  } catch {
    return null;
  }
}

async function readBlobPostsUncached(): Promise<BlogPost[]> {
  if (!hasBlobToken()) return [];
  try {
    const { blobs } = await list({ prefix: BLOB_PREFIX });
    const posts: BlogPost[] = [];
    for (const blob of blobs) {
      if (!blob.pathname.endsWith(".json")) continue;
      const res = await fetch(blob.url, { next: { revalidate: 300 } });
      if (!res.ok) continue;
      const parsed = (await res.json()) as BlogPost;
      if (parsed?.slug && parsed?.title) {
        posts.push({ ...parsed, source: parsed.source ?? "soro" });
      }
    }
    return posts;
  } catch (err) {
    console.error("blog blob list failed", err);
    return [];
  }
}

const readBlobPosts = unstable_cache(
  readBlobPostsUncached,
  ["blog-blob-posts"],
  { revalidate: 300 },
);

function sortPosts(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

/** Merge seed + Blob posts (Blob wins on same slug). */
export async function listBlogPosts(): Promise<BlogPost[]> {
  const [seed, blob] = await Promise.all([readSeedPosts(), readBlobPosts()]);
  const map = new Map<string, BlogPost>();
  for (const p of seed) map.set(p.slug, p);
  for (const p of blob) map.set(p.slug, p);
  return sortPosts([...map.values()]);
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const clean = slugify(slug);
  if (!clean) return null;

  if (hasBlobToken()) {
    const fromBlob = await readBlobPostByPath(`${BLOB_PREFIX}${clean}.json`);
    if (fromBlob) return fromBlob;
  }

  try {
    const raw = await fs.readFile(path.join(SEED_DIR, `${clean}.json`), "utf8");
    const parsed = JSON.parse(raw) as BlogPost;
    if (parsed?.slug && parsed?.title) {
      return { ...parsed, source: parsed.source ?? "seed" };
    }
  } catch {
    /* fall through */
  }

  return null;
}

export async function saveBlogPost(
  input: Omit<BlogPost, "source"> & { source?: BlogPost["source"] },
): Promise<BlogPost> {
  const slug = slugify(input.slug || input.title);
  if (!slug) throw new Error("Invalid slug");

  const post: BlogPost = {
    slug,
    title: input.title.trim(),
    description: input.description.trim(),
    body: input.body,
    coverImage: input.coverImage ?? null,
    publishedAt: input.publishedAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    source: input.source ?? "soro",
  };

  if (hasBlobToken()) {
    await put(`${BLOB_PREFIX}${slug}.json`, JSON.stringify(post, null, 2), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return post;
  }

  await fs.mkdir(SEED_DIR, { recursive: true });
  await fs.writeFile(
    path.join(SEED_DIR, `${slug}.json`),
    JSON.stringify(post, null, 2),
    "utf8",
  );
  return post;
}

export function blogStorageMode(): "blob" | "filesystem" {
  return hasBlobToken() ? "blob" : "filesystem";
}
