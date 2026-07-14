import brandRules from "../../../content/seo/brand-rules.json";

export type BrandRules = typeof brandRules;

export function getBrandRules(): BrandRules {
  return brandRules;
}

export function brandLint(post: {
  title?: string;
  description?: string;
  body?: string;
  html?: string;
}): { ok: boolean; errors: string[] } {
  const rules = getBrandRules();
  const errors: string[] = [];
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
