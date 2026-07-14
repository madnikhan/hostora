/**
 * Shared paths + brand lint for Hostora SEO draft pipeline.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, "../..");
export const TOPICS_PATH = path.join(ROOT, "content/seo/topics.json");
export const BRAND_RULES_PATH = path.join(ROOT, "content/seo/brand-rules.json");
export const GSC_SUGGESTIONS_PATH = path.join(
  ROOT,
  "content/seo/gsc-suggestions.json",
);
export const DRAFTS_DIR = path.join(ROOT, "content/blog/drafts");
export const MESSAGING_PATH = path.join(ROOT, "docs/MESSAGING.md");

/** Load KEY=VALUE from .env / .env.local into process.env (does not override existing). */
export function loadEnvFiles() {
  for (const name of [".env", ".env.local"]) {
    const filePath = path.join(ROOT, name);
    if (!fs.existsSync(filePath)) continue;
    const text = fs.readFileSync(filePath, "utf8");
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq <= 0) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = val;
    }
  }
}

loadEnvFiles();

export function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

export function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export function loadBrandRules() {
  return readJson(BRAND_RULES_PATH);
}

export function loadTopics() {
  return readJson(TOPICS_PATH);
}

export function saveTopics(topics) {
  writeJson(TOPICS_PATH, topics);
}

export function slugify(input) {
  return String(input)
    .toLowerCase()
    .trim()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

/**
 * @param {{ title?: string, description?: string, body?: string, html?: string }} post
 * @returns {{ ok: boolean, errors: string[] }}
 */
export function brandLint(post) {
  const rules = loadBrandRules();
  const errors = [];
  const blob = [post.title, post.description, post.body || post.html]
    .filter(Boolean)
    .join("\n");
  const lower = blob.toLowerCase();

  for (const phrase of rules.deniedPhrases || []) {
    if (lower.includes(phrase.toLowerCase())) {
      errors.push(`Denied phrase: "${phrase}"`);
    }
  }
  for (const pat of rules.deniedPatterns || []) {
    const body = String(pat).replace(/^\(\?i\)/, "");
    const re = new RegExp(body, "i");
    if (re.test(blob)) {
      errors.push(`Denied pattern: ${pat}`);
    }
  }

  for (const p of rules.mustIncludePaths || []) {
    if (!blob.includes(p)) {
      errors.push(`Missing required path link/mention: ${p}`);
    }
  }

  if (!post.title || String(post.title).trim().length < 12) {
    errors.push("Title too short");
  }
  const body = post.body || post.html || "";
  if (body.replace(/<[^>]+>/g, "").trim().length < 400) {
    errors.push("Body too short (need substantial article)");
  }

  return { ok: errors.length === 0, errors };
}

export function listDraftFiles() {
  if (!fs.existsSync(DRAFTS_DIR)) return [];
  return fs
    .readdirSync(DRAFTS_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => path.join(DRAFTS_DIR, f));
}

export function loadMessagingExcerpt(maxChars = 4000) {
  try {
    return fs.readFileSync(MESSAGING_PATH, "utf8").slice(0, maxChars);
  } catch {
    return "";
  }
}
