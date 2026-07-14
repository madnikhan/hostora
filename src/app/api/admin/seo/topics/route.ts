import { NextResponse } from "next/server";
import { loadTopics } from "@/lib/seo/adminStore";

export async function GET() {
  const topics = await loadTopics();
  return NextResponse.json({ topics });
}
