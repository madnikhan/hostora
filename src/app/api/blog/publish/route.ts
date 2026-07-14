import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { saveBlogPost, blogStorageMode } from "@/lib/blog/store";
import { slugify } from "@/lib/blog/types";
import { siteUrl } from "@/lib/company";
import { rateLimit } from "@/lib/booking/rateLimit";

/**
 * Soro / webhook publish endpoint.
 * POST Authorization: Bearer <SORO_WEBHOOK_SECRET>
 * Body: { title, slug?, description?, body|content|html, coverImage?, publishedAt? }
 */
const bodySchema = z.object({
  title: z.string().trim().min(3).max(200),
  slug: z.string().trim().min(2).max(120).optional(),
  description: z.string().trim().max(500).optional(),
  body: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  html: z.string().min(1).optional(),
  coverImage: z.string().url().optional().nullable(),
  cover_image: z.string().url().optional().nullable(),
  publishedAt: z.string().optional(),
  published_at: z.string().optional(),
});

function authorized(request: Request): boolean {
  const secret = process.env.SORO_WEBHOOK_SECRET;
  if (!secret) return false;
  const header = request.headers.get("authorization") || "";
  const bearer = header.match(/^Bearer\s+(.+)$/i)?.[1]?.trim();
  const alt =
    request.headers.get("x-soro-secret") ||
    request.headers.get("x-webhook-secret");
  return bearer === secret || alt === secret;
}

export async function POST(request: Request) {
  if (!process.env.SORO_WEBHOOK_SECRET) {
    return NextResponse.json(
      {
        error:
          "SORO_WEBHOOK_SECRET is not set. Add it on the server before connecting Soro.",
      },
      { status: 503 },
    );
  }

  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const limited = rateLimit(`blog-publish:${ip}`, 30, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload. Need title and body/content/html." },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const body = data.body || data.content || data.html;
  if (!body) {
    return NextResponse.json(
      { error: "Missing body (body, content, or html)." },
      { status: 400 },
    );
  }

  const slug = slugify(data.slug || data.title);
  const description =
    data.description ||
    body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 220);

  try {
    const post = await saveBlogPost({
      slug,
      title: data.title,
      description,
      body,
      coverImage: data.coverImage ?? data.cover_image ?? null,
      publishedAt: data.publishedAt || data.published_at || new Date().toISOString(),
      source: "soro",
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath("/sitemap.xml");

    const url = `${siteUrl}/blog/${post.slug}`;
    return NextResponse.json({
      ok: true,
      slug: post.slug,
      url,
      storage: blogStorageMode(),
    });
  } catch (err) {
    console.error("blog publish failed", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Could not save blog post.",
      },
      { status: 502 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: "/api/blog/publish",
    storage: blogStorageMode(),
    auth: "Authorization: Bearer <SORO_WEBHOOK_SECRET>",
  });
}
