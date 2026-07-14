import { DEFAULT_SORO_EMBED_ID } from "@/lib/seo/soroEmbedId";

export type SoroArticleMeta = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string | null;
  date?: string;
  isoDate?: string;
};

function embedId(): string {
  return (
    process.env.NEXT_PUBLIC_SORO_EMBED_ID?.trim() || DEFAULT_SORO_EMBED_ID
  );
}

function embedScriptUrl(id: string): string {
  return `https://app.trysoro.com/api/embed/${id}?theme=dark`;
}

/** Parse baked-in SORO_ARTICLES from Soro's embed script. */
export function parseSoroArticles(script: string): SoroArticleMeta[] {
  const match = script.match(/SORO_ARTICLES\s*=\s*(\[[\s\S]*?\]);/);
  if (!match?.[1]) return [];
  try {
    const raw = JSON.parse(match[1]) as unknown;
    if (!Array.isArray(raw)) return [];
    const out: SoroArticleMeta[] = [];
    for (const row of raw) {
      if (!row || typeof row !== "object") continue;
      const r = row as Record<string, unknown>;
      const slug = String(r.slug || "").trim();
      const title = String(r.title || "").trim();
      if (!slug || !title) continue;
      out.push({
        id: r.id ? String(r.id) : undefined,
        title,
        slug,
        excerpt: String(r.excerpt || r.description || "").trim(),
        image: r.image ? String(r.image) : null,
        date: r.date ? String(r.date) : undefined,
        isoDate: r.isoDate ? String(r.isoDate) : undefined,
      });
    }
    return out;
  } catch {
    return [];
  }
}

export async function listSoroArticles(): Promise<SoroArticleMeta[]> {
  const id = embedId();
  if (!id) return [];
  try {
    const res = await fetch(embedScriptUrl(id), {
      next: { revalidate: 120 },
    });
    if (!res.ok) return [];
    const script = await res.text();
    return parseSoroArticles(script);
  } catch (err) {
    console.error("soro embed fetch failed", err);
    return [];
  }
}

export async function getSoroArticleBySlug(
  slug: string,
): Promise<SoroArticleMeta | null> {
  const clean = slug.trim().toLowerCase();
  if (!clean) return null;
  const articles = await listSoroArticles();
  return articles.find((a) => a.slug.toLowerCase() === clean) ?? null;
}
