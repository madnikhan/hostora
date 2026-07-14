#!/usr/bin/env node
/**
 * Generate one SEO blog draft from the highest-priority queued topic.
 * Requires SEO_LLM_API_KEY (OpenAI-compatible Chat Completions API).
 *
 * Usage: npm run seo:draft
 */
import fs from "node:fs";
import path from "node:path";
import {
  DRAFTS_DIR,
  brandLint,
  listDraftFiles,
  loadBrandRules,
  loadMessagingExcerpt,
  loadTopics,
  saveTopics,
  slugify,
  writeJson,
} from "./lib.mjs";

function env(name, fallback = "") {
  return (process.env[name] || fallback).trim();
}

async function chatCompletion(messages) {
  const apiKey = env("SEO_LLM_API_KEY") || env("OPENAI_API_KEY");
  if (!apiKey) {
    throw new Error(
      "Missing SEO_LLM_API_KEY (or OPENAI_API_KEY). Set it in .env.local / CI secrets.",
    );
  }
  const base = (env("SEO_LLM_BASE_URL") || "https://api.openai.com/v1").replace(
    /\/$/,
    "",
  );
  const model = env("SEO_LLM_MODEL") || "gpt-4o-mini";

  const res = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`LLM error ${res.status}: ${text.slice(0, 500)}`);
  }
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("LLM returned empty content");
  return JSON.parse(content);
}

function pickTopic(topics) {
  const openDrafts = listDraftFiles();
  if (openDrafts.length > 0) {
    throw new Error(
      `A draft already exists (${path.basename(openDrafts[0])}). Publish or remove it before drafting another.`,
    );
  }
  const queued = topics
    .filter((t) => t.status === "queued")
    .sort((a, b) => (b.priority || 0) - (a.priority || 0));
  if (!queued.length) {
    throw new Error("No queued topics in content/seo/topics.json");
  }
  return queued[0];
}

function buildPrompt(topic, rules, messaging) {
  return `You are writing a Hostora blog article for UK hospitality operators.

PRODUCT: Hostora by ${rules.vendor}. Markets: ${rules.markets}.
PACK LANGUAGE: ${rules.packLanguage}

MESSAGING EXCERPT:
${messaging}

TOPIC:
- keyword: ${topic.keyword}
- angle: ${topic.angle}
- vertical: ${topic.vertical}

REQUIREMENTS:
- UK English
- HTML body only (use <p>, <h2>, <ul><li>, <a href="...">). No <html> or <body> wrapper.
- Include at least one clear CTA link to /contact (book a demo)
- When relevant, link /product, /solutions, and/or /hardware
- Do NOT claim Hostora is hotel PMS, rooms, front desk, or housekeeping
- Do NOT call the product Fumari (Fumari may only be mentioned as a possible private client venue, preferably avoid)
- Do NOT invent prices, rankings, or customer logos
- Do NOT frame Hostora as a bespoke/custom software project — packs for Restaurant/Takeaway/Events; configured hotel F&B / carts
- 700–1100 words equivalent
- Practical floor ops tone — confident, sparse, operational

Return JSON object with keys:
- title (string)
- description (string, max 220 chars, meta)
- slug (kebab-case)
- html (string, article HTML)
`;
}

const topics = loadTopics();
const topic = pickTopic(topics);
const rules = loadBrandRules();
const messaging = loadMessagingExcerpt();

console.log("Drafting topic:", topic.id, "—", topic.keyword);

const generated = await chatCompletion([
  {
    role: "system",
    content: "You write brand-safe Hostora SEO articles. Always return valid JSON.",
  },
  { role: "user", content: buildPrompt(topic, rules, messaging) },
]);

const title = String(generated.title || "").trim();
const description = String(generated.description || "").trim().slice(0, 220);
const html = String(generated.html || generated.body || "").trim();
const slug = slugify(generated.slug || title);

const draft = {
  slug,
  title,
  description,
  body: html,
  coverImage: null,
  publishedAt: null,
  status: "draft",
  source: "hostora",
  topicId: topic.id,
  keyword: topic.keyword,
  createdAt: new Date().toISOString(),
};

const lint = brandLint(draft);
if (!lint.ok) {
  console.error("Brand lint failed:\n -", lint.errors.join("\n - "));
  process.exit(1);
}

fs.mkdirSync(DRAFTS_DIR, { recursive: true });
const outPath = path.join(DRAFTS_DIR, `${slug}.json`);
writeJson(outPath, draft);

const nextTopics = topics.map((t) =>
  t.id === topic.id ? { ...t, status: "drafted", draftSlug: slug } : t,
);
saveTopics(nextTopics);

console.log("Wrote", outPath);
console.log("Review, then: npm run seo:publish -- --slug=" + slug);
