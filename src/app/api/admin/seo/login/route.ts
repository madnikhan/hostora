import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { rateLimit } from "@/lib/booking/rateLimit";
import {
  ADMIN_SEO_COOKIE,
  adminPassword,
  adminSigningSecret,
  sessionCookieOptions,
  signAdminSession,
} from "@/lib/seo/adminAuth";

const bodySchema = z.object({
  password: z.string().min(1).max(200),
});

export async function POST(request: Request) {
  const password = adminPassword();
  if (!password) {
    return NextResponse.json(
      {
        error:
          "ADMIN_SEO_PASSWORD (or BLOG_PUBLISH_SECRET) is not set on the server.",
      },
      { status: 503 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const limited = rateLimit(`seo-admin-login:${ip}`, 8, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many attempts", retryAfterSec: limited.retryAfterSec },
      { status: 429 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Password required" }, { status: 400 });
  }

  if (parsed.data.password !== password) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const secret = adminSigningSecret();
  if (!secret) {
    return NextResponse.json(
      { error: "Admin signing secret missing" },
      { status: 503 },
    );
  }

  const token = await signAdminSession(secret);
  const jar = await cookies();
  jar.set(ADMIN_SEO_COOKIE, token, sessionCookieOptions());
  return NextResponse.json({ ok: true });
}
