#!/usr/bin/env node
/**
 * Export CapCut-ready Hostora brand pack:
 *   public/brand/hostora-mark.png
 *   public/brand/hostora-lockup.png
 *   public/brand/hostora-lockup-dark.png
 *   public/brand/hostora-logo-motion.mp4
 *
 * Usage: node scripts/export_brand_pack.mjs
 * Requires: Playwright Chromium, ffmpeg
 */
import { spawn } from "node:child_process";
import { mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const brandDir = path.join(root, "public", "brand");
const tmpDir = path.join(root, "tmp", "brand-pack");

const GOLD = "#E8A54B";
const CREAM = "#F4F1EA";
const BG = "#0B0B0C";
const MOTION_MS = 3000;

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: "inherit" });
    child.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`)),
    );
  });
}

/** Official mark: rounded tile + gold H stroke (matches mark.svg). */
function markSvg(size = 512, { tile = true, animated = false } = {}) {
  const sw = size * (5.5 / 64);
  const pad = size * (18 / 64);
  const mid = size / 2;
  const r = size * (14 / 64);
  const left = pad;
  const right = size - pad;
  const top = size * (14 / 64);
  const bot = size - top;
  const pathLen = animated ? 280 : undefined;

  const tileRect = tile
    ? `<rect width="${size}" height="${size}" rx="${r}" fill="${BG}"/>`
    : "";

  const animAttrs = animated
    ? `stroke-dasharray="${pathLen}" stroke-dashoffset="${pathLen}" class="draw-h"`
    : "";

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none">
  ${tileRect}
  <path d="M${left} ${top}v${bot - top}M${right} ${top}v${bot - top}M${left} ${mid}h${right - left}"
    stroke="${GOLD}" stroke-width="${sw}" stroke-linecap="round" ${animAttrs}/>
</svg>`;
}

function fontsCss() {
  return `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: Syne, system-ui, sans-serif; }
`;
}

function lockupHtml({ dark = false, size = 1024 } = {}) {
  const bg = dark ? BG : "transparent";
  const markSize = Math.round(size * 0.28);
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
${fontsCss()}
html, body { width: ${size}px; height: ${size}px; background: ${bg}; overflow: hidden; }
.wrap {
  width: ${size}px; height: ${size}px;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: ${Math.round(size * 0.045)}px;
}
.word {
  color: ${CREAM};
  font-weight: 800;
  font-size: ${Math.round(size * 0.12)}px;
  letter-spacing: -0.04em;
  line-height: 1;
}
</style></head>
<body>
  <div class="wrap" id="shot">
    <div id="mark">${markSvg(markSize, { tile: true })}</div>
    <div class="word">Hostora</div>
  </div>
</body></html>`;
}

function markOnlyHtml(size = 1024) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
html, body { width: ${size}px; height: ${size}px; background: transparent; overflow: hidden; }
#shot { width: ${size}px; height: ${size}px; display: grid; place-items: center; }
</style></head>
<body>
  <div id="shot">${markSvg(size, { tile: true })}</div>
</body></html>`;
}

function motionHtml() {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
${fontsCss()}
html, body {
  width: 1080px; height: 1080px;
  background: ${BG};
  overflow: hidden;
}
.stage {
  width: 1080px; height: 1080px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 36px;
  position: relative;
}
.glow {
  position: absolute;
  width: 420px; height: 420px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(232,165,75,0.22), transparent 68%);
  opacity: 0;
  animation: glowIn 1.2s 0.4s ease-out forwards;
  pointer-events: none;
}
.mark-wrap {
  width: 280px; height: 280px;
  opacity: 0;
  transform: scale(0.86);
  animation: markIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards,
             pulse 1.4s 1.1s ease-in-out infinite alternate;
}
.draw-h {
  animation: draw 1s 0.15s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
.word {
  color: ${CREAM};
  font-weight: 800;
  font-size: 96px;
  letter-spacing: -0.04em;
  opacity: 0;
  transform: translateY(18px);
  animation: wordIn 0.65s 0.85s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
.tag {
  color: rgba(154,149,140,0.95);
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  opacity: 0;
  animation: wordIn 0.55s 1.25s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
@keyframes draw {
  to { stroke-dashoffset: 0; }
}
@keyframes markIn {
  to { opacity: 1; transform: scale(1); }
}
@keyframes pulse {
  from { filter: drop-shadow(0 0 0 rgba(232,165,75,0)); }
  to { filter: drop-shadow(0 0 28px rgba(232,165,75,0.35)); }
}
@keyframes glowIn {
  to { opacity: 1; }
}
@keyframes wordIn {
  to { opacity: 1; transform: translateY(0); }
}
</style></head>
<body>
  <div class="stage" data-brand-canvas>
    <div class="glow"></div>
    <div class="mark-wrap">${markSvg(280, { tile: true, animated: true })}</div>
    <div class="word">Hostora</div>
    <div class="tag">Hospitality OS</div>
  </div>
</body></html>`;
}

await mkdir(brandDir, { recursive: true });
await mkdir(tmpDir, { recursive: true });

const browser = await chromium.launch({ headless: true });

async function shotHtml(html, outPath, { omitBackground = false, size = 1024 } = {}) {
  const page = await browser.newPage({
    viewport: { width: size, height: size },
    deviceScaleFactor: 1,
  });
  await page.setContent(html, { waitUntil: "networkidle" });
  // Wait for webfont if present
  await page.waitForTimeout(600);
  await page.locator("#shot").screenshot({
    path: outPath,
    omitBackground,
    type: "png",
  });
  await page.close();
  console.log("Wrote", outPath);
}

console.log("Exporting PNGs…");
await shotHtml(markOnlyHtml(1024), path.join(brandDir, "hostora-mark.png"), {
  omitBackground: true,
});
await shotHtml(lockupHtml({ dark: false, size: 1024 }), path.join(brandDir, "hostora-lockup.png"), {
  omitBackground: true,
});
await shotHtml(lockupHtml({ dark: true, size: 1024 }), path.join(brandDir, "hostora-lockup-dark.png"), {
  omitBackground: false,
});

console.log("Recording logo motion…");
const captureDir = path.join(tmpDir, "capture-motion");
await rm(captureDir, { recursive: true, force: true });
await mkdir(captureDir, { recursive: true });

const context = await browser.newContext({
  viewport: { width: 1080, height: 1080 },
  deviceScaleFactor: 1,
  recordVideo: { dir: captureDir, size: { width: 1080, height: 1080 } },
});
const page = await context.newPage();
await page.setContent(motionHtml(), { waitUntil: "networkidle" });
await page.waitForSelector("[data-brand-canvas]");
await page.waitForTimeout(MOTION_MS);
await context.close();
await browser.close();

const files = (await readdir(captureDir)).filter((f) => f.endsWith(".webm"));
if (!files.length) throw new Error("No webm from logo motion capture");
const webm = path.join(captureDir, files.sort().at(-1));
const mp4 = path.join(brandDir, "hostora-logo-motion.mp4");

await run("ffmpeg", [
  "-y",
  "-i",
  webm,
  "-t",
  String(MOTION_MS / 1000),
  "-vf",
  "scale=1080:1080:force_original_aspect_ratio=decrease,pad=1080:1080:(ow-iw)/2:(oh-ih)/2:color=0x0B0B0C",
  "-c:v",
  "libx264",
  "-pix_fmt",
  "yuv420p",
  "-an",
  "-movflags",
  "+faststart",
  mp4,
]);

console.log("Wrote", mp4);
console.log("Brand pack ready in public/brand/");
