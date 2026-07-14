import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_SEO_COOKIE } from "@/lib/seo/adminAuth";

export async function POST() {
  const jar = await cookies();
  jar.set(ADMIN_SEO_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return NextResponse.json({ ok: true });
}
