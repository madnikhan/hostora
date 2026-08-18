import { NextResponse } from "next/server";
import { goRedirects } from "@/lib/outreach/groups";
import { siteUrl } from "@/lib/company";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  const { slug } = await ctx.params;
  const target = goRedirects[slug];
  if (!target) {
    return NextResponse.redirect(`${siteUrl}/contact`);
  }
  return NextResponse.redirect(target, 302);
}
