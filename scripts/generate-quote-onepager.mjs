#!/usr/bin/env node
/**
 * Guest-facing quote / one-pager — strict single dark A4 page.
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
import { attachBrandPages } from "./lib/pdfTheme.mjs";

fs.mkdirSync(SALES_DIR, { recursive: true });

const out = path.join(SALES_DIR, "Hostora-Quote-Pack.pdf");
const doc = new PDFDocument({
  size: "A4",
  bufferPages: true,
  autoFirstPage: true,
  margins: { top: 36, bottom: 36, left: 40, right: 40 },
  info: {
    Title: `${brand.product} Quote Pack`,
    Author: brand.legalName,
    Subject: "Demo follow-up one-pager",
  },
});

const stream = fs.createWriteStream(out);
doc.pipe(stream);

const M = 40;
attachBrandPages(doc, {
  margin: M,
  footerLine: `${brand.product}  ·  ${brand.email}  ·  ${brand.site}`,
});
const contentW = doc.page.width - M * 2;
const pageBottom = doc.page.height - 48;

function sectionLabel(label, y) {
  doc
    .fillColor(colorsHex.accent)
    .fontSize(8)
    .font("Helvetica-Bold")
    .text(label, M, y, { characterSpacing: 1.2, lineBreak: false });
  return y + 12;
}

let y = M;

if (fs.existsSync(markPng)) {
  doc.image(markPng, M, y, { width: 24, height: 24 });
}
doc
  .fillColor(colorsHex.accent)
  .fontSize(8)
  .font("Helvetica-Bold")
  .text("QUOTE PACK", M + 34, y + 6, { lineBreak: false, characterSpacing: 1.5 });

y += 34;
doc
  .fillColor(colorsHex.fg)
  .fontSize(22)
  .font("Helvetica-Bold")
  .text(brand.product, M, y, { lineBreak: false });

y += 26;
doc
  .fillColor(colorsHex.accent)
  .fontSize(10)
  .font("Helvetica-Bold")
  .text(brand.tagline, M, y, { width: contentW, lineBreak: false });

y += 18;
const shortLine =
  "Restaurant / Takeaway / Events packs · hotel F&B and food carts configured · optional Docker local server + floor kit · US, UK & Europe.";
doc
  .fillColor(colorsHex.muted)
  .fontSize(9)
  .font("Helvetica")
  .text(shortLine, M, y, { width: contentW, lineGap: 1 });
y = doc.y + 10;

y = sectionLabel("VERTICALS", y);
doc
  .fillColor(colorsHex.fg)
  .fontSize(8)
  .font("Helvetica")
  .text(verticals.join("  ·  "), M, y, { width: contentW, lineGap: 1 });
y = doc.y + 10;

y = sectionLabel("MODULES", y);
const colW = (contentW - 10) / 2;
const rowH = 28;
modules.forEach((mod, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const x = M + col * (colW + 10);
  const yy = y + row * rowH;
  doc
    .fillColor(colorsHex.fg)
    .fontSize(8)
    .font("Helvetica-Bold")
    .text(mod.name, x, yy, { width: colW, lineBreak: false });
  doc
    .fillColor(colorsHex.muted)
    .fontSize(7)
    .font("Helvetica")
    .text(mod.desc, x, yy + 11, { width: colW, lineBreak: false });
});
y += Math.ceil(modules.length / 2) * rowH + 6;

y = sectionLabel("HARDWARE (OPTIONAL)", y);
doc
  .fillColor(colorsHex.muted)
  .fontSize(8)
  .font("Helvetica")
  .text(hardware.join("  ·  "), M, y, { width: contentW, lineGap: 1 });
y = doc.y + 10;

y = sectionLabel("GO-LIVE", y);
const steps = [
  "1 Survey  ·  2 Install pack (± Docker + kit)  ·  3 Train  ·  4 Live service",
];
doc
  .fillColor(colorsHex.fg)
  .fontSize(9)
  .font("Helvetica")
  .text(steps[0], M, y, { width: contentW, lineBreak: false });
y += 16;

y = sectionLabel("PRICING", y);
doc
  .fillColor(colorsHex.muted)
  .fontSize(8)
  .font("Helvetica")
  .text(
    "Package quote after demo (Restaurant / Takeaway / Events). Configured quote for hotel F&B and food carts. No public price list.",
    M,
    y,
    { width: contentW, lineGap: 1 },
  );
y = doc.y + 12;

const ctaH = 50;
if (y + ctaH > pageBottom - 20) {
  throw new Error(`CTA would overflow (y=${y})`);
}
doc.roundedRect(M, y, contentW, ctaH, 8).fill(colorsHex.surface);
doc
  .fillColor(colorsHex.fg)
  .fontSize(11)
  .font("Helvetica-Bold")
  .text("Book your free Hostora demo", M + 12, y + 10, { lineBreak: false });
doc
  .fillColor(colorsHex.muted)
  .fontSize(8)
  .font("Helvetica")
  .text(
    `${brand.site}/contact  ·  ${brand.email}  ·  ${brand.markets}`,
    M + 12,
    y + 28,
    { lineBreak: false },
  );

doc
  .fillColor(colorsHex.muted)
  .fontSize(7)
  .font("Helvetica")
  .text(
    `${brand.legalName} · ${brand.companyNumber} · ${brand.registeredOffice}`,
    M,
    pageBottom - 22,
    { width: contentW, lineBreak: false },
  );

const range = doc.bufferedPageRange();
if (range.count !== 1) {
  throw new Error(
    `Quote pack must be exactly 1 page, got ${range.count}. Tighten content.`,
  );
}

doc.end();

await new Promise((resolve, reject) => {
  stream.on("finish", resolve);
  stream.on("error", reject);
});

console.log("Wrote", out, "(1 page)");
