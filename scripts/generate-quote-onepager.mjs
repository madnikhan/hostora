#!/usr/bin/env node
/**
 * Guest-facing quote / one-pager PDF → public/sales/Hostora-Quote-Pack.pdf
 * Usage: node scripts/generate-quote-onepager.mjs
 */
import fs from "node:fs";
import path from "node:path";
import PDFDocument from "pdfkit";
import {
  brand,
  colorsHex,
  hardware,
  markPng,
  modules,
  SALES_DIR,
  verticals,
} from "./lib/brand.mjs";

fs.mkdirSync(SALES_DIR, { recursive: true });

const out = path.join(SALES_DIR, "Hostora-Quote-Pack.pdf");
const doc = new PDFDocument({
  size: "A4",
  margins: { top: 48, bottom: 48, left: 48, right: 48 },
  info: {
    Title: `${brand.product} Quote Pack`,
    Author: brand.legalName,
    Subject: "Demo follow-up one-pager",
  },
});

const stream = fs.createWriteStream(out);
doc.pipe(stream);

const W = doc.page.width;
const H = doc.page.height;
const M = 48;
const contentW = W - M * 2;

function paintBg() {
  doc.save();
  doc.rect(0, 0, W, H).fill(colorsHex.bg);
  doc.restore();
}

function footer() {
  doc
    .fillColor(colorsHex.muted)
    .fontSize(8)
    .font("Helvetica")
    .text(
      `${brand.product}  ·  ${brand.legalName}  ·  ${brand.email}  ·  ${brand.site}`,
      M,
      H - 32,
      { width: contentW, align: "left" },
    );
}

paintBg();
footer();

if (fs.existsSync(markPng)) {
  doc.image(markPng, M, M, { width: 36 });
}

doc
  .fillColor(colorsHex.accent)
  .fontSize(9)
  .font("Helvetica-Bold")
  .text("QUOTE PACK", M + 48, M + 8, { characterSpacing: 2 });

doc
  .fillColor(colorsHex.fg)
  .fontSize(26)
  .font("Helvetica-Bold")
  .text(brand.product, M, M + 52, { width: contentW });

doc
  .fillColor(colorsHex.accent)
  .fontSize(12)
  .font("Helvetica-Bold")
  .text(brand.tagline, M, doc.y + 6, { width: contentW });

doc
  .fillColor(colorsHex.muted)
  .fontSize(10)
  .font("Helvetica")
  .text(brand.oneLiner, M, doc.y + 10, { width: contentW, lineGap: 3 });

let y = doc.y + 18;

doc
  .fillColor(colorsHex.accent)
  .fontSize(9)
  .font("Helvetica-Bold")
  .text("VERTICALS", M, y, { characterSpacing: 1.5 });
y = doc.y + 8;
doc
  .fillColor(colorsHex.fg)
  .fontSize(10)
  .font("Helvetica")
  .text(verticals.join("  ·  "), M, y, { width: contentW });

y = doc.y + 16;
doc
  .fillColor(colorsHex.accent)
  .fontSize(9)
  .font("Helvetica-Bold")
  .text("MODULES", M, y, { characterSpacing: 1.5 });
y = doc.y + 8;

for (const mod of modules) {
  doc
    .fillColor(colorsHex.fg)
    .fontSize(10)
    .font("Helvetica-Bold")
    .text(mod.name, M, y, { width: contentW * 0.35, continued: false });
  const nameBottom = doc.y;
  doc
    .fillColor(colorsHex.muted)
    .fontSize(9)
    .font("Helvetica")
    .text(mod.desc, M + contentW * 0.38, y, { width: contentW * 0.62 });
  y = Math.max(nameBottom, doc.y) + 6;
  if (y > H - 120) break;
}

y += 8;
doc
  .fillColor(colorsHex.accent)
  .fontSize(9)
  .font("Helvetica-Bold")
  .text("HARDWARE (OPTIONAL)", M, y, { characterSpacing: 1.5 });
y = doc.y + 8;
doc
  .fillColor(colorsHex.muted)
  .fontSize(9)
  .font("Helvetica")
  .text(hardware.join("  ·  "), M, y, { width: contentW, lineGap: 2 });

y = doc.y + 16;
doc
  .fillColor(colorsHex.accent)
  .fontSize(9)
  .font("Helvetica-Bold")
  .text("GO-LIVE", M, y, { characterSpacing: 1.5 });
y = doc.y + 8;

const steps = [
  "1  Survey — covers, stations, printers, vertical",
  "2  Configure — software ± Docker local server and kit",
  "3  Train — floor and kitchen on live workflows",
  "4  Live service — one spine under peak load",
];
for (const step of steps) {
  doc
    .fillColor(colorsHex.fg)
    .fontSize(10)
    .font("Helvetica")
    .text(step, M, y, { width: contentW });
  y = doc.y + 4;
}

y += 10;
doc
  .fillColor(colorsHex.accent)
  .fontSize(9)
  .font("Helvetica-Bold")
  .text("PRICING", M, y, { characterSpacing: 1.5 });
y = doc.y + 8;
doc
  .fillColor(colorsHex.muted)
  .fontSize(10)
  .font("Helvetica")
  .text(
    "Package quote after demo for Restaurant / Takeaway / Events. Configured quote for hotel F&B and food carts. No public price list — we scope stations, hardware, and go-live on the demo.",
    M,
    y,
    { width: contentW, lineGap: 3 },
  );

y = doc.y + 18;
doc
  .roundedRect(M, y, contentW, 72, 12)
  .fill(colorsHex.surface);

doc
  .fillColor(colorsHex.fg)
  .fontSize(12)
  .font("Helvetica-Bold")
  .text("Book your free Hostora demo", M + 16, y + 16, {
    width: contentW - 32,
  });
doc
  .fillColor(colorsHex.muted)
  .fontSize(10)
  .font("Helvetica")
  .text(
    `${brand.site}/contact  ·  ${brand.email}  ·  ${brand.markets}`,
    M + 16,
    y + 38,
    { width: contentW - 32 },
  );

doc
  .fillColor(colorsHex.muted)
  .fontSize(8)
  .font("Helvetica")
  .text(
    `${brand.legalName} · Company ${brand.companyNumber} · ${brand.registeredOffice}`,
    M,
    H - 52,
    { width: contentW },
  );

doc.end();

await new Promise((resolve, reject) => {
  stream.on("finish", resolve);
  stream.on("error", reject);
});

console.log("Wrote", out);
