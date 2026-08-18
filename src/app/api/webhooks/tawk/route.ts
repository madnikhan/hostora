import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import {
  appendTawkTranscript,
  createOrUpdateTawkLead,
} from "@/lib/leads/store";

type TawkPayload = {
  event?: string;
  chatId?: string;
  time?: string;
  domain?: string;
  referrer?: string;
  message?: { text?: string; type?: string; sender?: { type?: string } };
  visitor?: {
    name?: string;
    email?: string;
    phone?: string;
    city?: string;
    country?: string;
  };
  property?: { id?: string; name?: string };
  transcript?: string;
};

function verifyTawkSignature(body: string, signature: string | null): boolean {
  const secret = process.env.TAWK_WEBHOOK_SECRET?.trim();
  if (!secret) return false;
  if (!signature) return false;
  const expected = createHmac("sha1", secret).update(body).digest("hex");
  try {
    const a = Buffer.from(expected, "utf8");
    const b = Buffer.from(signature, "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return expected === signature;
  }
}

function extractPhone(message?: string): string | undefined {
  if (!message) return undefined;
  const m = message.match(/(?:phone|mobile|tel)[:\s]*([+\d\s()-]{7,})/i);
  return m?.[1]?.trim();
}

export async function POST(request: Request) {
  const raw = await request.text();
  const signature = request.headers.get("x-tawk-signature");

  if (!verifyTawkSignature(raw, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: TawkPayload;
  try {
    payload = JSON.parse(raw) as TawkPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const event = payload.event?.toLowerCase() ?? "";
  const chatId = payload.chatId?.trim();
  if (!chatId) {
    return NextResponse.json({ error: "Missing chatId" }, { status: 400 });
  }

  try {
    if (event === "chat:start") {
      const visitor = payload.visitor ?? {};
      const messageText = payload.message?.text;
      const email = visitor.email?.trim() || "";
      if (!email) {
        return NextResponse.json({ ok: true, skipped: "no email" });
      }
      const result = await createOrUpdateTawkLead({
        name: visitor.name ?? "Tawk visitor",
        email,
        phone: visitor.phone || extractPhone(messageText),
        tawkChatId: chatId,
        message: messageText,
        referrer: payload.referrer,
        city: visitor.city,
        country: visitor.country,
      });
      return NextResponse.json({
        ok: true,
        created: result.created,
        leadId: result.lead.id,
      });
    }

    if (
      event === "chat:end" ||
      event === "new chat transcript" ||
      event.includes("transcript")
    ) {
      const transcript =
        payload.transcript ||
        (payload.message?.text ? String(payload.message.text) : "");
      if (transcript) {
        await appendTawkTranscript(chatId, transcript);
      }
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true, ignored: event });
  } catch (err) {
    console.error("tawk webhook failed", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Webhook failed" },
      { status: 500 },
    );
  }
}
