#!/usr/bin/env node
/**
 * INTERNAL Hostora price book — hybrid: hardware one-time + software monthly.
 * CONFIDENTIAL. Do not link from the marketing site.
 * Usage: node scripts/generate-internal-pricebook.mjs
 */
import fs from "node:fs";
import path from "node:path";
import PDFDocument from "pdfkit";
import { brand, colorsHex, markPng, SALES_DIR } from "./lib/brand.mjs";
import { attachBrandPages } from "./lib/pdfTheme.mjs";
import {
  commercialRules,
  extraStationMonthly,
  formatGbp,
  formatGbpPrice,
  formatMonthly,
  goLiveFees,
  hardwareLines,
  pricingMeta,
  resilienceAddon,
  sampleQuotes,
  softwareExcludes,
  softwareIncludes,
  softwarePacks,
  starterKits,
  supportRates,
  warrantyVsChargeable,
} from "./lib/pricing.mjs";

fs.mkdirSync(SALES_DIR, { recursive: true });

const out = path.join(SALES_DIR, "Hostora-Internal-Price-Book.pdf");
const doc = new PDFDocument({
  size: "A4",
  bufferPages: true,
  autoFirstPage: true,
  margins: { top: 48, bottom: 52, left: 48, right: 48 },
  info: {
    Title: `${brand.product} Internal Price Book — CONFIDENTIAL`,
    Author: brand.legalName,
    Subject: "Internal sales only — hybrid hardware + monthly software",
  },
});

const stream = fs.createWriteStream(out);
doc.pipe(stream);

const M = 48;
const theme = attachBrandPages(doc, {
  margin: M,
  footerLine: `CONFIDENTIAL · INTERNAL ONLY · ${brand.product} · ${brand.legalName}`,
});
const contentW = theme.contentWidth();

function stamp(y = M) {
  doc
    .fillColor(colorsHex.accent)
    .fontSize(8)
    .font("Helvetica-Bold")
    .text("CONFIDENTIAL — INTERNAL SALES ONLY", M, y, {
      width: contentW,
      characterSpacing: 1.2,
      lineBreak: false,
    });
  return y + 16;
}

function eyebrow(text, y) {
  doc
    .fillColor(colorsHex.accent)
    .fontSize(9)
    .font("Helvetica-Bold")
    .text(text.toUpperCase(), M, y, {
      width: contentW,
      characterSpacing: 1.4,
      lineBreak: false,
    });
}

function h1(text, y) {
  doc
    .fillColor(colorsHex.fg)
    .fontSize(22)
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
  return stamp(M);
}

function rowBox(y, left, right, opts = {}) {
  const h = opts.h ?? 36;
  y = theme.ensureSpace(y, h + 8);
  doc.roundedRect(M, y, contentW, h, 6).fill(colorsHex.surface);
  doc
    .fillColor(colorsHex.fg)
    .fontSize(opts.leftSize ?? 10)
    .font("Helvetica-Bold")
    .text(left, M + 12, y + (opts.singleLine ? 12 : 8), {
      width: contentW * 0.58,
      lineBreak: false,
    });
  if (opts.sub) {
    doc
      .fillColor(colorsHex.muted)
      .fontSize(8)
      .font("Helvetica")
      .text(opts.sub, M + 12, y + 22, {
        width: contentW * 0.58,
        lineBreak: false,
      });
  }
  doc
    .fillColor(colorsHex.accent)
    .fontSize(opts.rightSize ?? 11)
    .font("Helvetica-Bold")
    .text(right, M + contentW * 0.58, y + 12, {
      width: contentW * 0.42 - 16,
      align: "right",
      lineBreak: false,
    });
  return y + h + 8;
}

// --- Page 1 Cover ---
let y = stamp(M);
if (fs.existsSync(markPng)) {
  doc.image(markPng, M, y + 8, { width: 40, height: 40 });
}
y += 60;
doc
  .fillColor(colorsHex.accent)
  .fontSize(10)
  .font("Helvetica-Bold")
  .text(brand.product.toUpperCase(), M, y, {
    characterSpacing: 2,
    lineBreak: false,
  });
y += 28;
doc
  .fillColor(colorsHex.fg)
  .fontSize(28)
  .font("Helvetica-Bold")
  .text("Internal price book", M, y, { width: contentW, lineBreak: false });
y += 40;
doc
  .fillColor(colorsHex.accent)
  .fontSize(14)
  .font("Helvetica-Bold")
  .text("Hardware cash. Software £50–£90 / month.", M, y, {
    width: contentW,
  });
y = para(
  "Default quote for UK independents. Never send this PDF to a prospect. Public site and guest quote pack stay price-free — quote after demo.",
  y + 16,
  11,
);
y = para(pricingMeta.vatNote, y + 14, 10);
y += 28;
doc.roundedRect(M, y, contentW, 120, 10).fill(colorsHex.surface);
doc
  .fillColor(colorsHex.fg)
  .fontSize(11)
  .font("Helvetica-Bold")
  .text(brand.legalName, M + 16, y + 18, { lineBreak: false });
doc
  .fillColor(colorsHex.muted)
  .fontSize(9)
  .font("Helvetica")
  .text(`Company ${brand.companyNumber}`, M + 16, y + 40, { lineBreak: false })
  .text(brand.registeredOffice, M + 16, y + 56, { width: contentW - 32 })
  .text(brand.email, M + 16, y + 78, { lineBreak: false })
  .text(`${brand.site}  ·  ${brand.markets}`, M + 16, y + 94, {
    lineBreak: false,
  });

// --- Page 2 How we sell ---
y = newPage();
eyebrow("Commercial model", y);
y = h1("Buy the kit. Rent the ops system.", y + 20);
y = para(
  "Charge full list for hardware. Charge monthly for the pack licence. Charge a one-time go-live fee for survey, install, and train. Charge visits when remote fair-use is not enough.",
  y + 12,
  11,
);
y += 20;
const phases = [
  { t: "Day 0 — Hardware", d: "Full RRP / starter kit / Docker — customer owns the kit." },
  { t: "Day 0 — Go-live", d: "Standard £790 or Events/Hotel £1,190 — survey, install, train." },
  {
    t: "Ongoing — Software",
    d: "£50–£90/mo by pack · 12-month minimum · remote updates + fair-use support.",
  },
  {
    t: "As needed — Visits",
    d: "On-site and overage remote billed on the rate card.",
  },
];
for (const p of phases) {
  y = rowBox(y, p.t, "", { h: 44, sub: p.d, singleLine: false });
}
y = para(
  "Pitch against patchwork till + kitchen tickets + booking widgets — not against free Square. Capital one-time software buyout = founder approval only.",
  y + 8,
  9,
);
y = para(
  "Other markets (US / EU): convert or local quote — this book is GBP UK.",
  y + 10,
  9,
);

// --- Page 3 Software monthly ---
y = newPage();
eyebrow("Software packs", y);
y = h1("Monthly licence per site.", y + 20);
y = para(
  `${pricingMeta.vatNote} Extra till / KDS licence: ${formatGbp(extraStationMonthly)}/mo beyond pack defaults.`,
  y + 10,
  9,
);
y += 14;
for (const pack of softwarePacks) {
  y = rowBox(y, pack.name, formatMonthly(pack), {
    h: 48,
    sub: `${pack.blurb} · ${pack.defaults}`,
  });
}
y += 4;
doc
  .fillColor(colorsHex.accent)
  .fontSize(9)
  .font("Helvetica-Bold")
  .text("INCLUDED IN MONTHLY", M, y, { lineBreak: false });
y += 14;
doc
  .fillColor(colorsHex.muted)
  .fontSize(9)
  .font("Helvetica")
  .text(softwareIncludes.map((s) => `• ${s}`).join("\n"), M, y, {
    width: contentW,
    lineGap: 2,
  });
y = doc.y + 12;
doc
  .fillColor(colorsHex.accent)
  .fontSize(9)
  .font("Helvetica-Bold")
  .text("NOT INCLUDED", M, y, { lineBreak: false });
y += 14;
doc
  .fillColor(colorsHex.muted)
  .fontSize(9)
  .font("Helvetica")
  .text(softwareExcludes.map((s) => `• ${s}`).join("\n"), M, y, {
    width: contentW,
    lineGap: 2,
  });

// --- Page 4 Go-live + Hardware ---
y = newPage();
eyebrow("Go-live setup", y);
y = h1("One-time survey, install, train.", y + 20);
y = para("Charged separately from monthly software.", y + 10, 9);
y += 14;
for (const fee of goLiveFees) {
  y = rowBox(y, fee.name, formatGbp(fee.price), {
    h: 44,
    sub: fee.applies,
  });
}

y += 8;
eyebrow("Hardware (one-time)", y);
y = para("Full list when Hostora supplies / resells kit.", y + 14, 9);
y += 12;
for (const h of hardwareLines) {
  const right = h.price == null ? "Acquirer quote" : formatGbp(h.price);
  y = rowBox(y, h.name, right, {
    h: h.note ? 44 : 34,
    sub: h.note,
    singleLine: !h.note,
  });
}

// --- Page 5 Starter kits + support ---
y = newPage();
eyebrow("Starter kits", y);
y = h1("Bundled RRP for fast quotes.", y + 20);
y += 12;
for (const kit of starterKits) {
  y = rowBox(y, kit.name, formatGbp(kit.price), {
    h: 40,
    sub: kit.contents,
  });
}
y = rowBox(y, resilienceAddon.name, formatGbp(resilienceAddon.price), {
  h: 34,
  singleLine: true,
});

y += 8;
eyebrow("Support rate card", y);
y = para(
  `${warrantyVsChargeable.warranty} ${warrantyVsChargeable.chargeable}`,
  y + 14,
  9,
);
y += 12;
for (const r of supportRates) {
  const right = r.unit.includes("mile")
    ? `${formatGbp(r.price)} / mile + time`
    : `${formatGbp(r.price)} ${r.unit}`;
  y = rowBox(y, r.name, right, { h: 36, singleLine: true });
}

// --- Page 6 Examples + rules ---
y = newPage();
eyebrow("Close rules & examples", y);
y = h1("Same-day hybrid quote.", y + 20);
y = para(
  "Day-0 = hardware + go-live (ex VAT). Then monthly software. Add VAT at 20%.",
  y + 10,
  9,
);
y += 14;
for (const q of sampleQuotes) {
  y = theme.ensureSpace(y, 110);
  doc.roundedRect(M, y, contentW, 100, 8).fill(colorsHex.surface);
  doc
    .fillColor(colorsHex.fg)
    .fontSize(11)
    .font("Helvetica-Bold")
    .text(q.name, M + 14, y + 10, { lineBreak: false });
  let ly = y + 28;
  for (const line of q.lines) {
    doc
      .fillColor(colorsHex.muted)
      .fontSize(9)
      .font("Helvetica")
      .text(`${line.label}  ${formatGbp(line.amount)}`, M + 14, ly, {
        lineBreak: false,
      });
    ly += 12;
  }
  doc
    .fillColor(colorsHex.accent)
    .fontSize(11)
    .font("Helvetica-Bold")
    .text(
      `Day-0 ${formatGbp(q.day0Total)}  ·  then ${formatGbp(q.monthly)}/mo (${q.monthlyLabel})`,
      M + 14,
      y + 78,
      { lineBreak: false },
    );
  y += 110;
}
y += 2;
doc
  .fillColor(colorsHex.accent)
  .fontSize(9)
  .font("Helvetica-Bold")
  .text("DISCOUNT & DEPOSIT", M, y, { lineBreak: false });
y += 14;
doc
  .fillColor(colorsHex.muted)
  .fontSize(9)
  .font("Helvetica")
  .text(commercialRules.map((r) => `• ${r}`).join("\n"), M, y, {
    width: contentW,
    lineGap: 3,
  });

// --- Page 7 Checklist ---
y = newPage();
eyebrow("Rep checklist", y);
y = h1("Fill this before you leave the demo.", y + 20);
y = para(
  "Assemble the commercial quote on paper or email — never email this price book file.",
  y + 10,
  9,
);
y += 16;
const blanks = [
  "Venue / legal entity: ________________________________",
  "Pack (circle): Food cart / Takeaway / Restaurant / Events / Hotel F&B",
  `Monthly list £____/mo   Extra stations × ____  @ ${formatGbp(extraStationMonthly)}/mo`,
  "Starter kit: Takeaway / Restaurant / Events / none  + Docker Y/N",
  "Itemised hardware extras: ____________________________",
  "Go-live: Standard £790 / Complex £1,190   = £________",
  "Hardware day-0 £________   Deposit 30% £________",
  "First month software due on go-live  ·  Go-live date ________",
  "Quote valid until ________   Rep ________",
];
for (const b of blanks) {
  y = theme.ensureSpace(y, 28);
  doc
    .fillColor(colorsHex.fg)
    .fontSize(10)
    .font("Helvetica")
    .text(b, M, y, { width: contentW, lineBreak: false });
  y += 26;
}
y += 8;
doc.roundedRect(M, y, contentW, 64, 8).fill(colorsHex.surface);
doc
  .fillColor(colorsHex.accent)
  .fontSize(9)
  .font("Helvetica-Bold")
  .text("REMINDER", M + 14, y + 14, { lineBreak: false });
doc
  .fillColor(colorsHex.muted)
  .fontSize(9)
  .font("Helvetica")
  .text(
    "Guest leave-behinds: Brochure + Quote Pack (no £). Internal only: this price book + sales manual.",
    M + 14,
    y + 32,
    { width: contentW - 28 },
  );

const pages = doc.bufferedPageRange().count;
doc.end();

await new Promise((resolve, reject) => {
  stream.on("finish", resolve);
  stream.on("error", reject);
});

console.log("Wrote", out, `(${pages} pages) — CONFIDENTIAL HYBRID`);
