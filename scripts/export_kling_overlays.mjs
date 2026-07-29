#!/usr/bin/env node
/**
 * Export transparent Kling overlay GIFs (5s each, Syne / cream / gold):
 *   public/brand/kling/01-hook.gif
 *   public/brand/kling/02-brand.gif
 *   public/brand/kling/03-system.gif
 *   public/brand/kling/04-proof.gif
 *   public/brand/kling/05-cta.gif
 *
 * Usage: node scripts/export_kling_overlays.mjs
 * Requires: Playwright Chromium, ffmpeg
 */
import { spawn } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "public", "brand", "kling");
const tmpRoot = path.join(root, "tmp", "kling-overlays");

const GOLD = "#E8A54B";
const CREAM = "#F4F1EA";
const BG = "#0B0B0C";
const SIZE = 1080;
const FPS = 20;
const DURATION_S = 5;
const FRAME_COUNT = FPS * DURATION_S; // 100

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: "inherit" });
    child.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`)),
    );
  });
}

function markSvg(size = 280, { tile = true, animated = false } = {}) {
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
html, body {
  width: ${SIZE}px; height: ${SIZE}px;
  background: transparent;
  overflow: hidden;
  font-family: Syne, system-ui, sans-serif;
}
.stage {
  width: ${SIZE}px; height: ${SIZE}px;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 28px;
  padding: 64px;
  text-align: center;
}
.eyebrow {
  color: ${GOLD};
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  opacity: 0;
  transform: translateY(12px);
}
.headline {
  color: ${CREAM};
  font-weight: 800;
  font-size: 64px;
  letter-spacing: -0.04em;
  line-height: 0.95;
  max-width: 920px;
  opacity: 0;
  transform: translateY(18px);
}
.sub {
  color: ${GOLD};
  font-weight: 700;
  font-size: 28px;
  letter-spacing: -0.02em;
  line-height: 1.15;
  max-width: 860px;
  opacity: 0;
  transform: translateY(14px);
}
.word {
  color: ${CREAM};
  font-weight: 800;
  font-size: 96px;
  letter-spacing: -0.04em;
  line-height: 1;
  opacity: 0;
  transform: translateY(18px);
}
.tag {
  color: ${GOLD};
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  opacity: 0;
  transform: translateY(12px);
}
.mark-wrap {
  width: 220px; height: 220px;
  opacity: 0;
  transform: scale(0.88);
}
.draw-h {
  animation: draw 0.9s 0.15s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
@keyframes draw { to { stroke-dashoffset: 0; } }
@keyframes fadeUp {
  to { opacity: 1; transform: translateY(0) scale(1); }
}
`;
}

/** Scene templates — hard opacity (GIF-friendly), Syne timing over 5s. */
const scenes = [
  {
    id: "01-hook",
    html: () => `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
${fontsCss()}
.eyebrow { animation: fadeUp 0.55s 0.15s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
.headline { font-size: 58px; animation: fadeUp 0.65s 0.75s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
</style></head>
<body>
  <div class="stage" id="shot" data-kling-overlay>
    <p class="eyebrow">Hostora</p>
    <h1 class="headline">Still managing everything<br/>manually?</h1>
  </div>
</body></html>`,
  },
  {
    id: "02-brand",
    html: () => `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
${fontsCss()}
.mark-wrap { animation: fadeUp 0.6s 0.1s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
.word { animation: fadeUp 0.6s 1.0s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
.tag { animation: fadeUp 0.55s 1.7s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
</style></head>
<body>
  <div class="stage" id="shot" data-kling-overlay>
    <div class="mark-wrap">${markSvg(220, { tile: true, animated: true })}</div>
    <div class="word">Hostora</div>
    <div class="tag">Hospitality OS</div>
  </div>
</body></html>`,
  },
  {
    id: "03-system",
    html: () => `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
${fontsCss()}
.headline { font-size: 72px; animation: fadeUp 0.65s 0.2s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
.sub { animation: fadeUp 0.6s 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
</style></head>
<body>
  <div class="stage" id="shot" data-kling-overlay>
    <h1 class="headline">One smart system</h1>
    <p class="sub">Till, kitchen, guests, payments</p>
  </div>
</body></html>`,
  },
  {
    id: "04-proof",
    html: () => `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
${fontsCss()}
.headline { font-size: 64px; animation: fadeUp 0.65s 0.2s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
.sub { animation: fadeUp 0.6s 1.15s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
</style></head>
<body>
  <div class="stage" id="shot" data-kling-overlay>
    <h1 class="headline">Save time.<br/>Increase sales.</h1>
    <p class="sub">One spine under peak service</p>
  </div>
</body></html>`,
  },
  {
    id: "05-cta",
    html: () => `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
${fontsCss()}
.headline { font-size: 68px; animation: fadeUp 0.65s 0.2s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
.sub { letter-spacing: -0.01em; font-size: 26px; animation: fadeUp 0.6s 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
</style></head>
<body>
  <div class="stage" id="shot" data-kling-overlay>
    <h1 class="headline">Book a free demo</h1>
    <p class="sub">hostorasoft.co.uk/contact</p>
  </div>
</body></html>`,
  },
];

async function encodeGif(framesDir, outPath) {
  const palette = path.join(framesDir, "palette.png");
  const pattern = path.join(framesDir, "frame-%04d.png");
  await run("ffmpeg", [
    "-y",
    "-framerate",
    String(FPS),
    "-i",
    pattern,
    "-vf",
    "scale=1080:1080:flags=lanczos,palettegen=reserve_transparent=1:stats_mode=diff",
    "-frames:v",
    "1",
    "-update",
    "1",
    palette,
  ]);
  await run("ffmpeg", [
    "-y",
    "-framerate",
    String(FPS),
    "-i",
    pattern,
    "-i",
    palette,
    "-lavfi",
    "scale=1080:1080:flags=lanczos[x];[x][1:v]paletteuse=alpha_threshold=128:dither=bayer:bayer_scale=3",
    "-loop",
    "0",
    outPath,
  ]);
}

await mkdir(outDir, { recursive: true });
await mkdir(tmpRoot, { recursive: true });

const browser = await chromium.launch({ headless: true });

for (const scene of scenes) {
  const framesDir = path.join(tmpRoot, scene.id);
  await rm(framesDir, { recursive: true, force: true });
  await mkdir(framesDir, { recursive: true });

  console.log(`\nCapturing ${scene.id} (${FRAME_COUNT} frames @ ${FPS}fps)…`);
  const page = await browser.newPage({
    viewport: { width: SIZE, height: SIZE },
    deviceScaleFactor: 1,
  });
  await page.setContent(scene.html(), { waitUntil: "networkidle" });
  // Wait for Syne to load
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
  });
  await page.waitForTimeout(400);
  await page.waitForSelector("[data-kling-overlay]");

  // Restart animations from t=0 by forcing reflow
  await page.evaluate(() => {
    const root = document.querySelector("[data-kling-overlay]");
    if (!root) return;
    const clone = root.cloneNode(true);
    root.replaceWith(clone);
  });
  // Tiny settle so first frame is pre-anim
  await page.waitForTimeout(16);

  for (let i = 0; i < FRAME_COUNT; i++) {
    const file = path.join(framesDir, `frame-${String(i).padStart(4, "0")}.png`);
    await page.locator("#shot").screenshot({
      path: file,
      omitBackground: true,
      type: "png",
    });
    if (i < FRAME_COUNT - 1) {
      await page.waitForTimeout(1000 / FPS);
    }
  }
  await page.close();

  const outPath = path.join(outDir, `${scene.id}.gif`);
  console.log(`Encoding ${outPath}…`);
  await encodeGif(framesDir, outPath);
  console.log("Wrote", outPath);
}

await browser.close();

const readme = `# Hostora Kling overlays

Transparent 1080×1080 · 5s · Syne / cream \`#F4F1EA\` / gold \`#E8A54B\`.

| File | Use on |
|------|--------|
| \`01-hook.gif\` | Clip 1 — hook question |
| \`02-brand.gif\` | Clip 2 — mark + Hostora |
| \`03-system.gif\` | Clip 3 — one smart system |
| \`04-proof.gif\` | Clip 4 — save time / sales |
| \`05-cta.gif\` | Clip 5 — book demo CTA |

Rebuild: \`npm run brand:kling\`
`;
await writeFile(path.join(outDir, "README.md"), readme);

console.log("\nKling overlay pack ready in public/brand/kling/");
