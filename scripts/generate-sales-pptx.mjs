import fs from "node:fs";
import path from "node:path";
import PptxGenJS from "pptxgenjs";
import {
  brand,
  colors,
  hardware,
  markPng,
  modules,
  SALES_DIR,
  verticals,
} from "./lib/brand.mjs";

fs.mkdirSync(SALES_DIR, { recursive: true });

const pptx = new PptxGenJS();
pptx.defineLayout({ name: "HOSTORA_WIDE", width: 13.333, height: 7.5 });
pptx.layout = "HOSTORA_WIDE";
pptx.author = brand.legalName;
pptx.title = `${brand.product} Sales Presentation`;
pptx.subject = brand.tagline;

const BG = colors.bg;
const FG = colors.fg;
const MUTED = colors.muted;
const ACCENT = colors.accent;

function addBase(slide) {
  slide.background = { color: BG };
}

function addFooter(slide, page, total = 12) {
  slide.addText(`${brand.product}  ·  ${brand.legalName}`, {
    x: 0.6,
    y: 7.05,
    w: 9,
    h: 0.3,
    fontSize: 10,
    color: MUTED,
    fontFace: "Arial",
  });
  slide.addText(`${page} / ${total}`, {
    x: 11.5,
    y: 7.05,
    w: 1.2,
    h: 0.3,
    fontSize: 10,
    color: MUTED,
    fontFace: "Arial",
    align: "right",
  });
}

function eyebrow(slide, text, y = 0.55) {
  slide.addText(text.toUpperCase(), {
    x: 0.7,
    y,
    w: 12,
    h: 0.35,
    fontSize: 12,
    color: ACCENT,
    fontFace: "Arial",
    bold: true,
    charSpacing: 4,
  });
}

function title(slide, text, opts = {}) {
  slide.addText(text, {
    x: 0.7,
    y: opts.y ?? 1.1,
    w: opts.w ?? 11.8,
    h: opts.h ?? 1.4,
    fontSize: opts.fontSize ?? 36,
    color: FG,
    fontFace: "Arial",
    bold: true,
    ...opts.extra,
  });
}

function body(slide, text, y = 2.8) {
  slide.addText(text, {
    x: 0.7,
    y,
    w: 11.5,
    h: 2.2,
    fontSize: 18,
    color: MUTED,
    fontFace: "Arial",
  });
}

const hasMark = fs.existsSync(markPng);

// 1 Title
{
  const s = pptx.addSlide();
  addBase(s);
  if (hasMark) {
    s.addImage({ path: markPng, x: 0.7, y: 0.55, w: 0.7, h: 0.7 });
  }
  eyebrow(s, brand.product, 1.5);
  title(s, "Run the floor.", { y: 2.0, fontSize: 48, h: 0.9 });
  s.addText("From booking to last pour.", {
    x: 0.7,
    y: 2.85,
    w: 12,
    h: 0.7,
    fontSize: 36,
    color: ACCENT,
    fontFace: "Arial",
    bold: true,
  });
  body(
    s,
    `Hospitality operations for restaurants, takeaways, event venues, hotels, and food carts — ${brand.markets}.`,
    3.8,
  );
  s.addText(`${brand.legalName}  ·  ${brand.site}`, {
    x: 0.7,
    y: 5.5,
    w: 12,
    h: 0.4,
    fontSize: 14,
    color: MUTED,
    fontFace: "Arial",
  });
  addFooter(s, 1);
}

// 2 Problem
{
  const s = pptx.addSlide();
  addBase(s);
  eyebrow(s, "The problem");
  title(s, "Busy nights break patchwork tools.");
  body(
    s,
    "Separate till apps, kitchen screens, booking widgets, and spreadsheets create missed tickets, slow service, and no single source of truth.",
  );
  const pains = [
    "Missed or duplicate kitchen tickets",
    "Slow payments and unclear reporting",
    "No supervisor visibility when service breaks",
    "Staff juggling tools instead of guests",
  ];
  pains.forEach((p, i) => {
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.7 + (i % 2) * 6.1,
      y: 4.2 + Math.floor(i / 2) * 1.0,
      w: 5.8,
      h: 0.8,
      fill: { color: colors.surface },
      rectRadius: 0.1,
    });
    s.addText(p, {
      x: 0.9 + (i % 2) * 6.1,
      y: 4.35 + Math.floor(i / 2) * 1.0,
      w: 5.4,
      h: 0.5,
      fontSize: 14,
      color: FG,
      fontFace: "Arial",
    });
  });
  addFooter(s, 2);
}

// 3 Who it's for
{
  const s = pptx.addSlide();
  addBase(s);
  eyebrow(s, "Who it's for");
  title(s, "Five businesses. One spine.");
  body(
    s,
    "Packaged for restaurants, takeaways, and events. Hotel F&B and food carts configured to each operator — still F&B/ops, not a hotel PMS.",
    2.6,
  );
  verticals.forEach((v, i) => {
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.7 + i * 2.45,
      y: 4.6,
      w: 2.3,
      h: 1.5,
      fill: { color: colors.surface },
      rectRadius: 0.1,
    });
    s.addText(v, {
      x: 0.85 + i * 2.45,
      y: 5.05,
      w: 2.0,
      h: 0.7,
      fontSize: 14,
      color: FG,
      fontFace: "Arial",
      bold: true,
      align: "center",
    });
  });
  addFooter(s, 3);
}

// 4 Product map
{
  const s = pptx.addSlide();
  addBase(s);
  eyebrow(s, "The product");
  title(s, "One platform for the whole service.", { fontSize: 32, h: 1.0 });
  modules.slice(0, 9).forEach((m, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.7 + col * 4.1;
    const y = 2.4 + row * 1.35;
    s.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w: 3.9,
      h: 1.2,
      fill: { color: colors.surface },
      rectRadius: 0.08,
    });
    s.addText(m.name, {
      x: x + 0.15,
      y: y + 0.2,
      w: 3.6,
      h: 0.35,
      fontSize: 13,
      color: ACCENT,
      fontFace: "Arial",
      bold: true,
    });
    s.addText(m.desc, {
      x: x + 0.15,
      y: y + 0.55,
      w: 3.6,
      h: 0.5,
      fontSize: 11,
      color: MUTED,
      fontFace: "Arial",
    });
  });
  addFooter(s, 4);
}

// 5 Till
{
  const s = pptx.addSlide();
  addBase(s);
  eyebrow(s, "Till");
  title(s, "Orders that keep pace with the room.");
  body(
    s,
    "Open tabs, modifiers, split bills, and payments designed for real floor pressure — not demo day.",
  );
  addFooter(s, 5);
}

// 6 Kitchen
{
  const s = pptx.addSlide();
  addBase(s);
  eyebrow(s, "Kitchen & print");
  title(s, "Every station sees what matters.");
  body(
    s,
    "Live KDS by area, thermal routing for food / bar / specialty stations, and busy-period reliability.",
  );
  addFooter(s, 6);
}

// 7 Guests
{
  const s = pptx.addSlide();
  addBase(s);
  eyebrow(s, "Guests & QR");
  title(s, "Guests order. You prepare.");
  body(
    s,
    "Table ordering QR, seating invites, and reservation flows that connect guests to service.",
  );
  addFooter(s, 7);
}

// 8 Money
{
  const s = pptx.addSlide();
  addBase(s);
  eyebrow(s, "Money & insight");
  title(s, "Payments and reporting operators trust.");
  body(
    s,
    "Sales reports, hourly analytics, and day / week / month views — framed for US, UK, and European operators.",
  );
  addFooter(s, 8);
}

// 9 Control
{
  const s = pptx.addSlide();
  addBase(s);
  eyebrow(s, "Control");
  title(s, "Stock, staff, and supervisors.");
  body(
    s,
    "Inventory thresholds, HR and attendance, deletion audits, and live monitoring when the floor gets loud.",
  );
  addFooter(s, 9);
}

// 10 Hardware
{
  const s = pptx.addSlide();
  addBase(s);
  eyebrow(s, "Hardware (optional)");
  title(s, "Software plus floor kit when you need it.", { fontSize: 32 });
  body(
    s,
    "Optional local Docker server (Hostora + PostgreSQL) so tills, tablets, KDS, and printers stay on the venue network — quoted with software per venue.",
    2.5,
  );
  hardware.forEach((h, i) => {
    s.addText(`•  ${h}`, {
      x: 0.7,
      y: 4.0 + i * 0.38,
      w: 12,
      h: 0.35,
      fontSize: 14,
      color: FG,
      fontFace: "Arial",
    });
  });
  addFooter(s, 10);
}

// 11 Proof / how we sell
{
  const s = pptx.addSlide();
  addBase(s);
  eyebrow(s, "How we sell");
  title(s, "Proven under live service load.");
  body(
    s,
    "Hostora is the commercial brand for a platform already running multi-station hospitality venues. Markets: US, UK & Europe. Licensing is per venue — custom quotes for multi-site, hotel F&B, and food carts.",
  );
  s.addText("Do not call the product “Fumari.” Client venues are private case studies only.", {
    x: 0.7,
    y: 5.2,
    w: 12,
    h: 0.5,
    fontSize: 14,
    color: ACCENT,
    fontFace: "Arial",
  });
  addFooter(s, 11);
}

// 12 CTA
{
  const s = pptx.addSlide();
  addBase(s);
  eyebrow(s, "Next step");
  title(s, "Book a Hostora demo.");
  body(
    s,
    "Per-venue licensing. Custom quotes for multi-site. Leave this slide open and take discovery notes.",
  );
  s.addText(
    [
      { text: brand.email, options: { breakLine: true } },
      { text: brand.site, options: { breakLine: true } },
      { text: `${brand.legalName} · Company ${brand.companyNumber}`, options: { breakLine: true } },
      { text: brand.registeredOffice },
    ],
    {
      x: 0.7,
      y: 4.4,
      w: 12,
      h: 1.8,
      fontSize: 16,
      color: FG,
      fontFace: "Arial",
    },
  );
  addFooter(s, 12);
}

const out = path.join(SALES_DIR, "Hostora-Sales-Presentation.pptx");
await pptx.writeFile({ fileName: out });
console.log("Wrote", out);
