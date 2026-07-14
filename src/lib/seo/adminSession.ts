/**
 * Cookie session for /admin/seo — Web Crypto so middleware (Edge) and Route Handlers share it.
 */

export const ADMIN_SEO_COOKIE = "hostora_seo_admin";
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export function adminPassword(): string {
  return (
    process.env.ADMIN_SEO_PASSWORD?.trim() ||
    process.env.BLOG_PUBLISH_SECRET?.trim() ||
    ""
  );
}

export function adminSigningSecret(): string {
  return (
    process.env.ADMIN_SEO_SECRET?.trim() ||
    process.env.BLOG_PUBLISH_SECRET?.trim() ||
    process.env.ADMIN_SEO_PASSWORD?.trim() ||
    ""
  );
}

function toBase64Url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function hmacSign(secret: string, payload: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return toBase64Url(sig);
}

function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

export async function signAdminSession(
  secret: string,
  now = Date.now(),
): Promise<string> {
  const exp = String(now + MAX_AGE_MS);
  const sig = await hmacSign(secret, `seo-admin:${exp}`);
  return `${exp}.${sig}`;
}

export async function verifyAdminSession(
  token: string | undefined,
  secret: string,
): Promise<boolean> {
  if (!token || !secret) return false;
  const [expStr, sig] = token.split(".");
  if (!expStr || !sig) return false;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  const expected = await hmacSign(secret, `seo-admin:${expStr}`);
  return timingSafeEqualStr(sig, expected);
}

export function sessionMaxAgeSec() {
  return Math.floor(MAX_AGE_MS / 1000);
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: sessionMaxAgeSec(),
  };
}
