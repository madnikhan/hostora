#!/usr/bin/env node
/**
 * Hostora brochure — multi-page dark brand PDF with safe page backgrounds.
 * Usage: node scripts/generate-brochure.mjs
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

const out = path.join(SALES_DIR, "Hostora-Brochure.pdf");
const doc = new PDFDocument({
  size: "A4",
  bufferPages: true,
  autoFirstPage: true,
  margins: { top: 52, bottom: 52, left: 52, right: 52 },
  info: {
    Title: `${brand.product} Brochure`,
    Author: brand.legalName,
    Subject: brand.tagline,
  },
});

const stream = fs.createWriteStream(out);
doc.pipe(stream);

const M = 52;
const theme = attachBrandPages(doc, {
  margin: M,
  footerLine: `${brand.product}  ·  ${brand.legalName}  ·  ${brand.site}`,
});
const contentW = theme.contentWidth();

function eyebrow(text, y) {
  doc
    .fillColor(colorsHex.accent)
    .fontSize(9)
    .font("Helvetica-Bold")
    .text(text.toUpperCase(), M, y, {
      width: contentW,
      characterSpacing: 1.5,
      lineBreak: false,
    });
}

function h1(text, y) {
  doc
    .fillColor(colorsHex.fg)
    .fontSize(24)
    .font("Helvetica-Bold")
    .text(text, M, y, { width: contentW, lineGap: 2 });
  return doc.y;
}

function para(text, y, size = 10) {
  doc
    .fillColor(colorsHex.muted)
    .fontSize(size)
    .font("Helvetica")
    .text(text, M, y, { width: contentW, lineGap: 2 });
  return doc.y;
}

function newPage() {
  doc.addPage();
  return M;
}

// --- Page 1 Cover ---
let y = 64;
if (fs.existsSync(markPng)) {
  doc.image(markPng, M, y, { width: 48, height: 48 });
}
y = 130;
doc
  .fillColor(colorsHex.accent)
  .fontSize(10)
  .font("Helvetica-Bold")
  .text(brand.product.toUpperCase(), M, y, {
    characterSpacing: 2,
    lineBreak: false,
  });
y = 160;
doc
  .fillColor(colorsHex.fg)
  .fontSize(32)
  .font("Helvetica-Bold")
  .text("Run the floor.", M, y, { width: contentW, lineBreak: false });
y = 208;
doc
  .fillColor(colorsHex.accent)
  .fontSize(24)
  .font("Helvetica-Bold")
  .text("From booking to last pour.", M, y, {
    width: contentW,
    lineBreak: false,
  });
y = para(brand.oneLiner, 270, 11) + 40;
doc
  .fillColor(colorsHex.fg)
  .fontSize(11)
  .font("Helvetica")
  .text(brand.markets, M, y, { lineBreak: false });
y += 24;
doc
  .fillColor(colorsHex.muted)
  .fontSize(10)
  .text(`${brand.legalName}  ·  Company ${brand.companyNumber}`, M, y, {
    lineBreak: false,
  });
y += 18;
doc.text(brand.registeredOffice, M, y, { width: contentW });
y = doc.y + 12;
doc.text(brand.email, M, y, { lineBreak: false });

// --- Page 2 Verticals ---
y = newPage();
eyebrow("Who it's for", y);
y = h1("Packs for venues. Configured where it must be.", y + 22);
y = para(
  "Replace patchwork till + kitchen tickets + booking widgets — not a bespoke software project.",
  y + 12,
);
y += 22;
for (const v of verticals) {
  const boxH = 36;
  y = theme.ensureSpace(y, boxH + 10);
  doc.roundedRect(M, y, contentW, boxH, 8).fill(colorsHex.surface);
  doc
    .fillColor(colorsHex.fg)
    .fontSize(12)
    .font("Helvetica-Bold")
    .text(v, M + 14, y + 12, { width: contentW - 28, lineBreak: false });
  y += boxH + 10;
}
y += 6;
para(
  "Hotels: F&B and floor ops only (restaurant, room service, banquet) — not PMS. Food carts: configured to the cart footprint.",
  y,
  9,
);

// --- Page 3 Modules ---
y = newPage();
eyebrow("Software", y);
y = h1("Everything the floor needs.", y + 22);
y = para(
  "One platform for till, kitchen, guests, money, stock, staff, and control.",
  y + 10,
);
y += 18;
const colW = (contentW - 12) / 2;
const cardH = 52;
const moduleRows = Math.ceil(modules.length / 2);
const modulesBlockH = moduleRows * (cardH + 8);
if (y + modulesBlockH > theme.bottomLimit()) {
  y = newPage();
  eyebrow("Software", y);
  y = h1("Everything the floor needs.", y + 22);
  y = para(
    "One platform for till, kitchen, guests, money, stock, staff, and control.",
    y + 10,
  );
  y += 18;
}
modules.forEach((m, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const x = M + col * (colW + 12);
  const yy = y + row * (cardH + 8);
  doc.roundedRect(x, yy, colW, cardH, 8).fill(colorsHex.surface);
  doc
    .fillColor(colorsHex.accent)
    .fontSize(9)
    .font("Helvetica-Bold")
    .text(m.name, x + 10, yy + 10, { width: colW - 20, lineBreak: false });
  doc
    .fillColor(colorsHex.muted)
    .fontSize(8)
    .font("Helvetica")
    .text(m.desc, x + 10, yy + 26, {
      width: colW - 20,
      height: 22,
      lineBreak: false,
      ellipsis: true,
    });
});

// --- Page 4 Hardware ---
y = newPage();
eyebrow("Hardware (optional)", y);
y = h1("Deploy where the venue is.", y + 22);
y = para(
  "Optional floor kit — including a local Docker server running Hostora and PostgreSQL so every device stays online on your venue network. Quoted with your pack.",
  y + 12,
);
y += 22;
for (const h of hardware) {
  const line = `•  ${h}`;
  doc.fontSize(11).font("Helvetica");
  const need = doc.heightOfString(line, { width: contentW, lineGap: 1 }) + 8;
  y = theme.ensureSpace(y, need);
  doc
    .fillColor(colorsHex.fg)
    .fontSize(11)
    .font("Helvetica")
    .text(line, M, y, { width: contentW, lineGap: 1 });
  y = doc.y + 8;
}

// --- Page 5 Flow ---
y = newPage();
eyebrow("How service runs", y);
y = h1("Booking → till → kitchen → pay.", y + 22);
const steps = [
  { t: "1 · Book & seat", d: "Reservations, deposits, guest QR, and seating invites." },
  { t: "2 · Take the order", d: "Till or tablet POS with modifiers, notes, and open tabs." },
  { t: "3 · Fire the kitchen", d: "Station KDS and thermal tickets routed where they belong." },
  { t: "4 · Close the bill", d: "Payments, splits, reports — day, week, and month clarity." },
];
y += 16;
for (const s of steps) {
  const boxH = 62;
  y = theme.ensureSpace(y, boxH + 12);
  doc.roundedRect(M, y, contentW, boxH, 8).fill(colorsHex.surface);
  doc
    .fillColor(colorsHex.accent)
    .fontSize(11)
    .font("Helvetica-Bold")
    .text(s.t, M + 14, y + 12, { lineBreak: false });
  doc
    .fillColor(colorsHex.muted)
    .fontSize(10)
    .font("Helvetica")
    .text(s.d, M + 14, y + 34, { width: contentW - 28, lineBreak: false });
  y += boxH + 12;
}

// --- Page 6 Why ---
y = newPage();
eyebrow("Why Hostora", y);
y = h1("Built for live service load.", y + 22);
const why = [
  "One operational spine instead of a patchwork of apps",
  "Kitchen and print routing that survives busy periods",
  "Supervisor visibility when the floor gets loud",
  "Optional on-venue server for LAN resilience",
  "Markets across the US, UK, and Europe",
  "Package quotes for Restaurant / Takeaway / Events — configured hotel F&B and carts",
];
y += 16;
for (const w of why) {
  const line = `→  ${w}`;
  doc.fontSize(11).font("Helvetica");
  const need = doc.heightOfString(line, { width: contentW }) + 12;
  y = theme.ensureSpace(y, need);
  doc
    .fillColor(colorsHex.fg)
    .fontSize(11)
    .font("Helvetica")
    .text(line, M, y, { width: contentW });
  y = doc.y + 12;
}

// --- Page 7 CTA ---
y = newPage();
eyebrow("Next step", y);
y = h1("Book a Hostora demo.", y + 22);
y = para(
  "Restaurant / Takeaway / Events packs after demo. Configured installs for hotel F&B and carts. No public price list — we quote to your stations and kit.",
  y + 12,
);
y += 28;
const ctaH = 160;
y = theme.ensureSpace(y, ctaH);
doc.roundedRect(M, y, contentW, ctaH, 12).fill(colorsHex.surface);
doc
  .fillColor(colorsHex.fg)
  .fontSize(13)
  .font("Helvetica-Bold")
  .text(brand.legalName, M + 18, y + 20, { lineBreak: false });
doc
  .fillColor(colorsHex.muted)
  .fontSize(10)
  .font("Helvetica")
  .text(`Company number ${brand.companyNumber}`, M + 18, y + 44, {
    lineBreak: false,
  })
  .text(brand.registeredOffice, M + 18, y + 62, { width: contentW - 36 })
  .text(brand.email, M + 18, y + 92, { lineBreak: false })
  .text(brand.site, M + 18, y + 110, { lineBreak: false })
  .text(`Markets: ${brand.markets}`, M + 18, y + 128, { lineBreak: false });

const range = doc.bufferedPageRange();
const pages = range.count;
if (pages < 6 || pages > 9) {
  console.warn(`Warning: brochure page count ${pages} (expected ~7)`);
}

doc.end();

await new Promise((resolve, reject) => {
  stream.on("finish", resolve);
  stream.on("error", reject);
});

console.log("Wrote", out, `(${pages} pages)`);
