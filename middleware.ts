import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ADMIN_SEO_COOKIE,
  adminSigningSecret,
  verifyAdminSession,
} from "@/lib/seo/adminSession";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminPage = pathname.startsWith("/admin/seo");
  const isAdminApi = pathname.startsWith("/api/admin/seo");
  const isLoginPage = pathname === "/admin/seo/login";
  const isLoginApi = pathname === "/api/admin/seo/login";

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow");

  if (isLoginPage || isLoginApi) {
    return res;
  }

  const secret = adminSigningSecret();
  const token = request.cookies.get(ADMIN_SEO_COOKIE)?.value;
  const ok = await verifyAdminSession(token, secret);

  if (!ok) {
    if (isAdminApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const login = new URL("/admin/seo/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  return res;
}

export const config = {
  matcher: ["/admin/seo/:path*", "/api/admin/seo/:path*"],
};
