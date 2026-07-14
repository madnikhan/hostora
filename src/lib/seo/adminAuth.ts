import { cookies } from "next/headers";
import {
  ADMIN_SEO_COOKIE,
  adminSigningSecret,
  verifyAdminSession,
} from "@/lib/seo/adminSession";

export {
  ADMIN_SEO_COOKIE,
  adminPassword,
  adminSigningSecret,
  signAdminSession,
  verifyAdminSession,
  sessionCookieOptions,
} from "@/lib/seo/adminSession";

export async function isAdminAuthenticated(): Promise<boolean> {
  const secret = adminSigningSecret();
  if (!secret) return false;
  const jar = await cookies();
  return verifyAdminSession(jar.get(ADMIN_SEO_COOKIE)?.value, secret);
}
