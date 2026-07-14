#!/usr/bin/env node
/**
 * Publish an approved draft.
 *
 * Modes:
 *   --mode=git  (default) Write into content/blog/*.json — goes live on next deploy / git push
 *   --mode=api  POST /api/blog/publish (needs BLOB_READ_WRITE_TOKEN on Vercel)
 *
 * Usage:
 *   npm run seo:publish -- --slug=my-slug
 *   npm run seo:publish -- --slug=my-slug --mode=api
 */
import fs from "node:fs";
import path from "node:path";
import {
  DRAFTS_DIR,
  ROOT,
  brandLint,
  loadTopics,
  saveTopics,
  writeJson,
} from "./lib.mjs";

function arg(name) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : "";
}

function hasFlag(name) {
  return process.argv.includes(`--${name}`);
}

const slug = arg("slug");
const mode = (arg("mode") || "git").toLowerCase();

if (!slug) {
  console.error(
    "Usage: npm run seo:publish -- --slug=<slug> [--mode=git|api]",
  );
  process.exit(1);
}

const draftPath = path.join(DRAFTS_DIR, `${slug}.json`);
if (!fs.existsSync(draftPath)) {
  console.error("Draft not found:", draftPath);
  process.exit(1);
}

const draft = JSON.parse(fs.readFileSync(draftPath, "utf8"));
const lint = brandLint(draft);
if (!lint.ok) {
  console.error("Brand lint failed:\n -", lint.errors.join("\n - "));
  process.exit(1);
}

const publishedAt = new Date().toISOString();
const post = {
  slug: draft.slug,
  title: draft.title,
  description: draft.description,
  body: draft.body,
  coverImage: draft.coverImage ?? null,
  publishedAt,
  updatedAt: publishedAt,
  source: "hostora",
};

function markTopicPublished() {
  const topics = loadTopics();
  saveTopics(
    topics.map((t) =>
      t.draftSlug === slug || t.id === draft.topicId
        ? {
            ...t,
            status: "published",
            publishedSlug: slug,
            draftSlug: undefined,
          }
        : t,
    ),
  );
}

if (mode === "git") {
  const out = path.join(ROOT, "content", "blog", `${slug}.json`);
  writeJson(out, post);
  fs.unlinkSync(draftPath);
  markTopicPublished();
  console.log("Wrote", out);
  console.log(
    "Commit and push to publish on the live site (seed posts ship with the deploy).",
  );
  console.log(`URL after deploy: https://www.hostorasoft.co.uk/blog/${slug}`);
  if (!hasFlag("no-hint")) {
    console.log(
      "\nTip: use --mode=api only after Vercel shows storage:\"blob\" at /api/blog/publish",
    );
  }
  process.exit(0);
}

if (mode !== "api") {
  console.error("Unknown --mode. Use git or api.");
  process.exit(1);
}

const secret =
  (process.env.BLOG_PUBLISH_SECRET || process.env.SORO_WEBHOOK_SECRET || "").trim();
if (!secret) {
  console.error(`Missing BLOG_PUBLISH_SECRET.

Add to .env.local:
  BLOG_PUBLISH_SECRET=your-long-random-secret

Set the same value on Vercel → Environment Variables, then redeploy.
`);
  process.exit(1);
}

const url = (
  process.env.BLOG_PUBLISH_URL ||
  "https://www.hostorasoft.co.uk/api/blog/publish"
).trim();

const probe = await fetch(url.replace(/\/$/, "").replace(/\/publish$/, "/publish"), {
  method: "GET",
}).catch(() => null);
let storage = "unknown";
try {
  storage = (await probe?.json())?.storage || "unknown";
} catch {
  /* ignore */
}
if (storage === "filesystem") {
  console.error(`Production storage is still "filesystem" — API publish will fail (EROFS).

Fix: Vercel → Storage → Blob → copy BLOB_READ_WRITE_TOKEN into Production env → Redeploy.
Confirm: curl -sL https://www.hostorasoft.co.uk/api/blog/publish
  → must show "storage":"blob"

Or publish without Blob:
  npm run seo:publish -- --slug=${slug} --mode=git
`);
  process.exit(1);
}

const res = await fetch(url, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${secret}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    title: draft.title,
    slug: draft.slug,
    description: draft.description,
    html: draft.body,
    coverImage: draft.coverImage || undefined,
    publishedAt,
    source: "hostora",
  }),
});

const json = await res.json().catch(() => ({}));
if (!res.ok) {
  console.error("Publish failed", res.status, json);
  process.exit(1);
}

fs.unlinkSync(draftPath);
markTopicPublished();

console.log("Published", json.url || slug, "storage:", json.storage);
