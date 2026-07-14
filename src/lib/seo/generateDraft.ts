import { promises as fs } from "node:fs";
import path from "node:path";
import { getBrandRules } from "@/lib/seo/brandLint";
import type { SeoTopic } from "@/lib/seo/adminStore";
import { slugify } from "@/lib/blog/types";

export type GeneratedArticle = {
  title: string;
  description: string;
  slug: string;
  html: string;
};

async function loadMessagingExcerpt(maxChars = 4000): Promise<string> {
  try {
    const raw = await fs.readFile(
      path.join(process.cwd(), "docs", "MESSAGING.md"),
      "utf8",
    );
    return raw.slice(0, maxChars);
  } catch {
    return "";
  }
}

function buildPrompt(topic: SeoTopic, messaging: string): string {
  const rules = getBrandRules();
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

export async function generateSeoArticle(
  topic: SeoTopic,
): Promise<GeneratedArticle> {
  const apiKey =
    process.env.SEO_LLM_API_KEY?.trim() ||
    process.env.OPENAI_API_KEY?.trim() ||
    "";
  if (!apiKey) {
    throw new Error(
      "SEO_LLM_API_KEY is not set on this server. Add it on Vercel (Production) for Generate draft.",
    );
  }
  const base = (
    process.env.SEO_LLM_BASE_URL?.trim() || "https://api.openai.com/v1"
  ).replace(/\/$/, "");
  const model = process.env.SEO_LLM_MODEL?.trim() || "gpt-4o-mini";
  const messaging = await loadMessagingExcerpt();

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
      messages: [
        {
          role: "system",
          content:
            "You write brand-safe Hostora SEO articles. Always return valid JSON.",
        },
        { role: "user", content: buildPrompt(topic, messaging) },
      ],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`LLM error ${res.status}: ${text.slice(0, 500)}`);
  }
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("LLM returned empty content");
  const generated = JSON.parse(content) as {
    title?: string;
    description?: string;
    slug?: string;
    html?: string;
    body?: string;
  };

  const title = String(generated.title || "").trim();
  const description = String(generated.description || "").trim().slice(0, 220);
  const html = String(generated.html || generated.body || "").trim();
  const slug = slugify(generated.slug || title);
  if (!title || !html || !slug) {
    throw new Error("LLM returned incomplete article JSON");
  }
  return { title, description, slug, html };
}
