#!/usr/bin/env node
/**
 * Publish an approved draft via POST /api/blog/publish.
 * Usage: npm run seo:publish -- --slug=my-slug
 *
 * Env:
 *   BLOG_PUBLISH_SECRET (required)
 *   BLOG_PUBLISH_URL (default https://hostorasoft.co.uk/api/blog/publish)
 */
import fs from "node:fs";
import path from "node:path";
import {
  DRAFTS_DIR,
  brandLint,
  loadTopics,
  saveTopics,
  writeJson,
} from "./lib.mjs";

function arg(name) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : "";
}

const slug = arg("slug");
if (!slug) {
  console.error("Usage: npm run seo:publish -- --slug=<slug>");
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

const secret =
  (process.env.BLOG_PUBLISH_SECRET || process.env.SORO_WEBHOOK_SECRET || "").trim();
if (!secret) {
  console.error(`Missing BLOG_PUBLISH_SECRET.

Add to .env.local:
  BLOG_PUBLISH_SECRET=your-long-random-secret

Set the same value on Vercel → Environment Variables, then redeploy.
(Legacy alias SORO_WEBHOOK_SECRET still works if you already set that.)
`);
  process.exit(1);
}

const url = (
  process.env.BLOG_PUBLISH_URL ||
  // Use www — apex 308-redirects to www and drops Authorization → 401
  "https://www.hostorasoft.co.uk/api/blog/publish"
).trim();

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
    publishedAt: new Date().toISOString(),
    source: "hostora",
  }),
});

const json = await res.json().catch(() => ({}));
if (!res.ok) {
  console.error("Publish failed", res.status, json);
  process.exit(1);
}

fs.unlinkSync(draftPath);

const topics = loadTopics();
saveTopics(
  topics.map((t) =>
    t.draftSlug === slug || t.id === draft.topicId
      ? { ...t, status: "published", publishedSlug: slug, draftSlug: undefined }
      : t,
  ),
);

const archiveDir = path.join(DRAFTS_DIR, "..", "published-meta");
writeJson(path.join(archiveDir, `${slug}.json`), {
  ...draft,
  status: "published",
  publishedAt: new Date().toISOString(),
  liveUrl: json.url,
});

console.log("Published", json.url || slug, "storage:", json.storage);
