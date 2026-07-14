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

const out = path.join(SALES_DIR, "Hostora-Brochure.pdf");
const doc = new PDFDocument({
  size: "A4",
  margins: { top: 56, bottom: 56, left: 56, right: 56 },
  info: {
    Title: `${brand.product} Brochure`,
    Author: brand.legalName,
    Subject: brand.tagline,
  },
});

const stream = fs.createWriteStream(out);
doc.pipe(stream);

const W = doc.page.width;
const H = doc.page.height;
const M = 56;
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
      `${brand.product}  ·  ${brand.legalName}  ·  ${brand.site}`,
      M,
      H - 36,
      { width: contentW, align: "left" },
    );
}

function newPage() {
  doc.addPage();
  paintBg();
  footer();
}

function eyebrow(text, y) {
  doc
    .fillColor(colorsHex.accent)
    .fontSize(10)
    .font("Helvetica-Bold")
    .text(text.toUpperCase(), M, y, { width: contentW, characterSpacing: 2 });
}

function h1(text, y) {
  doc
    .fillColor(colorsHex.fg)
    .fontSize(28)
    .font("Helvetica-Bold")
    .text(text, M, y, { width: contentW, lineGap: 4 });
  return doc.y;
}

function para(text, y, size = 11) {
  doc
    .fillColor(colorsHex.muted)
    .fontSize(size)
    .font("Helvetica")
    .text(text, M, y, { width: contentW, lineGap: 3 });
  return doc.y;
}

// --- Page 1 Cover ---
paintBg();
if (fs.existsSync(markPng)) {
  doc.image(markPng, M, 72, { width: 56, height: 56 });
}
doc
  .fillColor(colorsHex.accent)
  .fontSize(11)
  .font("Helvetica-Bold")
  .text(brand.product.toUpperCase(), M, 150, { characterSpacing: 3 });
doc
  .fillColor(colorsHex.fg)
  .fontSize(36)
  .font("Helvetica-Bold")
  .text("Run the floor.", M, 180, { width: contentW });
doc
  .fillColor(colorsHex.accent)
  .fontSize(28)
  .font("Helvetica-Bold")
  .text("From booking to last pour.", M, 230, { width: contentW });
para(brand.oneLiner, 300, 12);
doc
  .fillColor(colorsHex.fg)
  .fontSize(11)
  .font("Helvetica")
  .text(`${brand.markets}`, M, 420);
doc
  .fillColor(colorsHex.muted)
  .fontSize(10)
  .text(`${brand.legalName}  ·  Company ${brand.companyNumber}`, M, 445);
doc.text(brand.registeredOffice, M, 462, { width: contentW });
doc.text(brand.email, M, 490);
footer();

// --- Page 2 Verticals ---
newPage();
eyebrow("Who it's for", M);
let y = h1("Five businesses. One operations spine.", M + 28);
y = para(
  "Hostora is built for how hospitality actually runs — not a generic till app with a new skin.",
  y + 16,
);
y += 28;
for (const v of verticals) {
  doc
    .roundedRect(M, y, contentW, 42, 8)
    .fill(colorsHex.surface);
  doc
    .fillColor(colorsHex.fg)
    .fontSize(13)
    .font("Helvetica-Bold")
    .text(v, M + 16, y + 14, { width: contentW - 32 });
  y += 54;
}
y += 8;
para(
  "Hotels: F&B and floor ops only (restaurant, room service, banquet kitchens) — not PMS, rooms, or front desk. Food carts: configured to the cart setup.",
  y,
  10,
);

// --- Page 3 Modules ---
newPage();
eyebrow("Software", M);
y = h1("Everything the floor needs.", M + 28);
y = para(
  "One platform for till, kitchen, guests, money, stock, staff, and control.",
  y + 12,
);
y += 24;
const colW = (contentW - 12) / 2;
modules.forEach((m, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const x = M + col * (colW + 12);
  const yy = y + row * 72;
  if (yy + 64 > H - 60) return;
  doc.roundedRect(x, yy, colW, 64, 8).fill(colorsHex.surface);
  doc
    .fillColor(colorsHex.accent)
    .fontSize(10)
    .font("Helvetica-Bold")
    .text(m.name, x + 12, yy + 12, { width: colW - 24 });
  doc
    .fillColor(colorsHex.muted)
    .fontSize(9)
    .font("Helvetica")
    .text(m.desc, x + 12, yy + 30, { width: colW - 24 });
});

// --- Page 4 Hardware ---
newPage();
eyebrow("Hardware (optional)", M);
y = h1("Deploy where the venue is.", M + 28);
y = para(
  "Optional floor kit — including a local Docker server running Hostora and PostgreSQL so every device stays online on your venue network. Quoted with software per venue.",
  y + 14,
);
y += 28;
for (const h of hardware) {
  doc
    .fillColor(colorsHex.fg)
    .fontSize(11)
    .font("Helvetica")
    .text(`•  ${h}`, M, y, { width: contentW });
  y += 26;
}

// --- Page 5 Flow ---
newPage();
eyebrow("How service runs", M);
y = h1("Booking → till → kitchen → pay.", M + 28);
const steps = [
  { t: "1 · Book & seat", d: "Reservations, deposits, guest QR, and seating invites." },
  { t: "2 · Take the order", d: "Till or tablet POS with modifiers, notes, and open tabs." },
  { t: "3 · Fire the kitchen", d: "Station KDS and thermal tickets routed where they belong." },
  { t: "4 · Close the bill", d: "Payments, splits, reports — day, week, and month clarity." },
];
y += 20;
for (const s of steps) {
  doc.roundedRect(M, y, contentW, 70, 8).fill(colorsHex.surface);
  doc
    .fillColor(colorsHex.accent)
    .fontSize(11)
    .font("Helvetica-Bold")
    .text(s.t, M + 16, y + 14);
  doc
    .fillColor(colorsHex.muted)
    .fontSize(11)
    .font("Helvetica")
    .text(s.d, M + 16, y + 36, { width: contentW - 32 });
  y += 84;
}

// --- Page 6 Why ---
newPage();
eyebrow("Why Hostora", M);
y = h1("Built for live service load.", M + 28);
const why = [
  "One operational spine instead of a patchwork of apps",
  "Kitchen and print routing that survives busy periods",
  "Supervisor visibility when the floor gets loud",
  "Optional on-venue server for LAN resilience",
  "Markets across the US, UK, and Europe",
  "Custom quotes — packaged verticals plus tailored hotel F&B and carts",
];
y += 20;
for (const w of why) {
  doc
    .fillColor(colorsHex.fg)
    .fontSize(12)
    .font("Helvetica")
    .text(`→  ${w}`, M, y, { width: contentW });
  y += 32;
}

// --- Page 7 CTA ---
newPage();
eyebrow("Next step", M);
y = h1("Book a Hostora demo.", M + 28);
y = para(
  "Per-venue licensing. Multi-site and tailored configurations by agreement. No public price list — we quote to your operation.",
  y + 14,
);
y += 40;
doc.roundedRect(M, y, contentW, 180, 12).fill(colorsHex.surface);
doc
  .fillColor(colorsHex.fg)
  .fontSize(14)
  .font("Helvetica-Bold")
  .text(brand.legalName, M + 20, y + 24);
doc
  .fillColor(colorsHex.muted)
  .fontSize(11)
  .font("Helvetica")
  .text(`Company number ${brand.companyNumber}`, M + 20, y + 50)
  .text(brand.registeredOffice, M + 20, y + 70, { width: contentW - 40 })
  .text(brand.email, M + 20, y + 100)
  .text(brand.site, M + 20, y + 120)
  .text(`Markets: ${brand.markets}`, M + 20, y + 140);

doc.end();

await new Promise((resolve, reject) => {
  stream.on("finish", resolve);
  stream.on("error", reject);
});
console.log("Wrote", out);
