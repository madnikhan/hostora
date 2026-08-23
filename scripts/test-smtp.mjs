#!/usr/bin/env node
/**
 * Verify IONOS SMTP credentials and send a test message.
 *
 * Usage:
 *   npm run booking:test-smtp -- you@example.com
 *   SMTP_PASS=... npm run booking:test-smtp -- you@example.com
 *
 * Loads .env and .env.local from repo root (does not override existing env).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import nodemailer from "nodemailer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

function loadEnvFiles() {
  for (const name of [".env", ".env.local"]) {
    const filePath = path.join(ROOT, name);
    if (!fs.existsSync(filePath)) continue;
    const text = fs.readFileSync(filePath, "utf8");
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq <= 0) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = val;
    }
  }
}

function env(name, fallback = "") {
  let value = (process.env[name] ?? fallback).trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1).trim();
  }
  return value;
}

loadEnvFiles();

const to = process.argv[2]?.trim();
if (!to) {
  console.error("Usage: npm run booking:test-smtp -- recipient@example.com");
  process.exit(1);
}

const host = env("SMTP_HOST", "smtp.ionos.co.uk");
const port = Number(env("SMTP_PORT", "587")) || 587;
const user = env("SMTP_USER", "sales@hostorasoft.co.uk");
const pass = env("SMTP_PASS");
const from = env("BOOKING_FROM_EMAIL", `Hostora <${user}>`);

if (!pass) {
  console.error("Missing SMTP_PASS. Set it in .env.local or the shell environment.");
  process.exit(1);
}

const transport = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  requireTLS: port === 587,
  auth: { user, pass },
  connectionTimeout: 20_000,
  greetingTimeout: 20_000,
  socketTimeout: 20_000,
});

async function main() {
  console.log(`SMTP host: ${host}:${port}`);
  console.log(`SMTP user: ${user}`);
  console.log(`From: ${from}`);
  console.log(`To: ${to}`);
  console.log("Verifying connection…");

  try {
    await transport.verify();
    console.log("verify: OK");
  } catch (err) {
    console.error("verify: FAILED");
    console.error(err);
    process.exit(1);
  }

  const info = await transport.sendMail({
    from,
    replyTo: user,
    to,
    subject: "Hostora SMTP test",
    text: "If you received this, IONOS SMTP is working from this machine.",
    html: "<p>If you received this, <strong>IONOS SMTP</strong> is working from this machine.</p>",
  });

  console.log("send: OK");
  console.log("messageId:", info.messageId || "(none)");
  console.log("response:", info.response || "(none)");
  console.log("Check inbox and spam folder.");
}

main()
  .catch((err) => {
    console.error("send: FAILED");
    console.error(err);
    process.exit(1);
  })
  .finally(() => {
    transport.close();
  });
