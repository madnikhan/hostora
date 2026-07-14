export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  /** HTML (preferred from Soro) or plain text */
  body: string;
  coverImage?: string | null;
  publishedAt: string;
  updatedAt?: string | null;
  source?: "seed" | "soro" | "hostora";
};

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

export function isHtmlBody(body: string): boolean {
  return /^\s*</.test(body);
}
