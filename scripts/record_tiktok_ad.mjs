#!/usr/bin/env node
/**
 * Record premium TikTok ads (restaurant / hotel / events) and mux VO+music.
 *
 * Usage:
 *   npm run build && npm run start
 *   node scripts/generate_tiktok_audio.mjs
 *   node scripts/record_tiktok_ad.mjs
 *   # or: npm run ad:tiktok:all
 *
 * Env: BASE_URL, DURATION_MS, VARIANT=restaurant|hotel|events|all
 */
import { spawn } from "node:child_process";
import { mkdir, access, readdir, copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "public", "ads");
const tmpDir = path.join(root, "tmp", "tiktok");
const audioDir = path.join(tmpDir, "audio");

const BASE = process.env.BASE_URL || "http://127.0.0.1:3000";
const DURATION = Number(process.env.DURATION_MS || 20_000);
const WANT = (process.env.VARIANT || "all").toLowerCase();

const ALL = ["restaurant", "hotel", "events"];
const variants = WANT === "all" ? ALL : ALL.filter((v) => v === WANT);

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: "inherit" });
    child.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`)),
    );
  });
}

async function waitForServer(url, tries = 90) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status < 500) return;
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`Server not reachable at ${url}`);
}

await mkdir(tmpDir, { recursive: true });
await mkdir(outDir, { recursive: true });

if (!variants.length) throw new Error(`Unknown VARIANT=${WANT}`);

console.log("Ensuring audio mixes…");
await run("node", [path.join(root, "scripts", "generate_tiktok_audio.mjs")]);

for (const id of variants) {
  const pageUrl = `${BASE.replace(/\/$/, "")}/ads/tiktok/${id}`;
  console.log(`Waiting for ${pageUrl}…`);
  await waitForServer(pageUrl);

  const captureDir = path.join(tmpDir, `capture-${id}`);
  await mkdir(captureDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1080, height: 1920 },
    deviceScaleFactor: 1,
    recordVideo: { dir: captureDir, size: { width: 1080, height: 1920 } },
  });
  const page = await context.newPage();
  await page.goto(pageUrl, { waitUntil: "networkidle" });
  await page.waitForSelector("[data-ad-canvas]");
  console.log(`Recording ${id} ${DURATION}ms…`);
  await page.waitForTimeout(DURATION);
  await context.close();
  await browser.close();

  const files = (await readdir(captureDir)).filter((f) => f.endsWith(".webm"));
  if (!files.length) throw new Error(`No webm for ${id}`);
  const webm = path.join(captureDir, files.sort().at(-1));
  const silentMp4 = path.join(tmpDir, `${id}-silent.mp4`);
  const mixWav = path.join(audioDir, `${id}-mix.wav`);
  const finalMp4 = path.join(outDir, `tiktok-hostora-${id}.mp4`);

  await run("ffmpeg", [
    "-y",
    "-i",
    webm,
    "-t",
    String(DURATION / 1000),
    "-vf",
    "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2",
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-preset",
    "medium",
    "-crf",
    "18",
    "-an",
    silentMp4,
  ]);

  await access(mixWav);
  await run("ffmpeg", [
    "-y",
    "-i",
    silentMp4,
    "-i",
    mixWav,
    "-t",
    "20",
    "-c:v",
    "copy",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    "-shortest",
    "-movflags",
    "+faststart",
    finalMp4,
  ]);

  console.log("Wrote", finalMp4);

  if (id === "restaurant") {
    await copyFile(finalMp4, path.join(outDir, "tiktok-hostora-15s.mp4"));
    console.log("Also wrote tiktok-hostora-15s.mp4 (restaurant alias)");
  }
}

console.log("Done.");
