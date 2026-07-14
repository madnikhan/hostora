import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { saveBlogPost, blogStorageMode } from "@/lib/blog/store";
import { slugify } from "@/lib/blog/types";
import { siteUrl } from "@/lib/company";
import { rateLimit } from "@/lib/booking/rateLimit";
import { brandLint } from "@/lib/seo/brandLint";

/**
 * Blog publish webhook (Soro + Hostora SEO CLI).
 * POST Authorization: Bearer <BLOG_PUBLISH_SECRET|SORO_WEBHOOK_SECRET>
 * Use www host — apex 308 can strip Authorization.
 * Body: { title, slug?, description?, body|content|html, coverImage?, publishedAt?, source? }
 * Nested wrappers article|data|post are unwrapped.
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
  source: z.enum(["soro", "hostora", "seed"]).optional(),
});

function publishSecret(): string {
  return (
    process.env.BLOG_PUBLISH_SECRET?.trim() ||
    process.env.SORO_WEBHOOK_SECRET?.trim() ||
    ""
  );
}

function authorized(request: Request): boolean {
  const secret = publishSecret();
  if (!secret) return false;
  const header = request.headers.get("authorization") || "";
  const bearer = header.match(/^Bearer\s+(.+)$/i)?.[1]?.trim();
  const alt =
    request.headers.get("x-blog-publish-secret") ||
    request.headers.get("x-webhook-secret") ||
    request.headers.get("x-soro-secret");
  return bearer === secret || alt === secret;
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Flatten Soro-style wrappers into one article object. */
function unwrapPublishPayload(json: unknown): Record<string, unknown> {
  if (!isPlainObject(json)) return {};
  const nestedKeys = ["article", "data", "post"] as const;
  let base: Record<string, unknown> = { ...json };
  for (const key of nestedKeys) {
    const inner = base[key];
    if (isPlainObject(inner)) {
      const { [key]: _drop, ...rest } = base;
      base = { ...inner, ...rest };
    }
  }
  return base;
}

function isWebhookTest(payload: Record<string, unknown>): boolean {
  const event = String(payload.event ?? payload.type ?? "").toLowerCase();
  if (event === "webhook.test" || event === "test") return true;
  if (payload.test === true) return true;
  return false;
}

function hasArticleFields(payload: Record<string, unknown>): boolean {
  const title = payload.title;
  const body = payload.body || payload.content || payload.html;
  return (
    typeof title === "string" &&
    title.trim().length >= 3 &&
    typeof body === "string" &&
    body.trim().length > 0
  );
}

export async function POST(request: Request) {
  if (!publishSecret()) {
    return NextResponse.json(
      {
        error:
          "BLOG_PUBLISH_SECRET (or SORO_WEBHOOK_SECRET) is not set. Add it on the server before publishing.",
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

  const flat = unwrapPublishPayload(json);

  // Connectivity pings: explicit test events, or no title+body payload
  if (isWebhookTest(flat) || !hasArticleFields(flat)) {
    return NextResponse.json({
      ok: true,
      test: true,
      message: "Webhook reachable; no post written.",
      storage: blogStorageMode(),
    });
  }

  const parsed = bodySchema.safeParse(flat);
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

  const lint = brandLint({
    title: data.title,
    description,
    body,
  });
  if (!lint.ok) {
    return NextResponse.json(
      {
        error: "Brand lint failed — fix before publish",
        lintErrors: lint.errors,
      },
      { status: 422 },
    );
  }

  try {
    const post = await saveBlogPost({
      slug,
      title: data.title,
      description,
      body,
      coverImage: data.coverImage ?? data.cover_image ?? null,
      publishedAt:
        data.publishedAt || data.published_at || new Date().toISOString(),
      source: data.source ?? "soro",
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
    const message =
      err instanceof Error ? err.message : "Could not save blog post.";
    const needsBlob =
      /EROFS|read-only file system/i.test(message) ||
      blogStorageMode() === "filesystem";
    return NextResponse.json(
      {
        error: needsBlob
          ? "Vercel cannot write blog files. Set BLOB_READ_WRITE_TOKEN on the Vercel project (Production), then redeploy. Create a store in Vercel → Storage → Blob if you do not have a token yet."
          : message,
      },
      { status: 502 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: "/api/blog/publish",
    publishUrl: "https://www.hostorasoft.co.uk/api/blog/publish",
    storage: blogStorageMode(),
    auth: "Authorization: Bearer <BLOG_PUBLISH_SECRET or SORO_WEBHOOK_SECRET>",
    note: "Use the www host; apex redirects can strip Authorization.",
  });
}
