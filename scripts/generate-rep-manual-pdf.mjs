/**
 * Print Hostora-Sales-Rep-Manual.txt as a clean light PDF.
 * Little design: white paper, amber top rule, Helvetica body, page footer.
 * Footer must stay above PDFKit's bottom margin or auto page breaks create blanks.
 */
import fs from "node:fs";
import path from "node:path";
import PDFDocument from "pdfkit";
import { brand, SALES_DIR } from "./lib/brand.mjs";

fs.mkdirSync(SALES_DIR, { recursive: true });

const txtPath = path.join(SALES_DIR, "Hostora-Sales-Rep-Manual.txt");
const out = path.join(SALES_DIR, "Hostora-Sales-Rep-Manual.pdf");

if (!fs.existsSync(txtPath)) {
  console.error("Missing", txtPath);
  process.exit(1);
}

const lines = fs.readFileSync(txtPath, "utf8").replace(/\r\n/g, "\n").split("\n");

const MARGIN = { top: 50, bottom: 52, left: 52, right: 52 };
const FG = "#222222";
const MUTED = "#444444";
const ACCENT = "#B8860B";
const RULE = "#E0E0E0";
const FOOTER_BAND = 22;

const doc = new PDFDocument({
  size: "A4",
  bufferPages: true,
  autoFirstPage: true,
  margins: MARGIN,
  info: {
    Title: `${brand.product} Sales Representative Manual`,
    Author: brand.legalName,
  },
});

const stream = fs.createWriteStream(out);
doc.pipe(stream);

const maxW = doc.page.width - MARGIN.left - MARGIN.right;
/** Body must stop above the footer line. */
const maxY = doc.page.height - MARGIN.bottom - FOOTER_BAND - 12;

let pageNum = 1;

function drawFooter() {
  // Stay above PDFKit’s bottom margin or .text() auto-adds a blank page.
  const fy = doc.page.height - MARGIN.bottom - 10;
  doc
    .strokeColor(RULE)
    .lineWidth(0.5)
    .moveTo(MARGIN.left, fy - 8)
    .lineTo(doc.page.width - MARGIN.right, fy - 8)
    .stroke();
  doc
    .fillColor("#777777")
    .font("Helvetica")
    .fontSize(8)
    .text(
      `${brand.product}  |  Sales Rep Manual  |  ${brand.legalName}  |  Page ${pageNum}`,
      MARGIN.left,
      fy,
      { width: maxW, lineBreak: false },
    );
}

doc.on("pageAdded", () => {
  pageNum += 1;
  drawFooter();
});

drawFooter();
doc.y = MARGIN.top;

function ensureSpace(h) {
  if (doc.y + h > maxY) {
    doc.addPage();
    doc.y = MARGIN.top;
  }
}

// Small header band (first page only)
doc
  .fillColor(ACCENT)
  .font("Helvetica-Bold")
  .fontSize(9)
  .text("HOSTORA  ·  SALES REPRESENTATIVE MANUAL", {
    width: maxW,
    characterSpacing: 1,
  });
doc.moveDown(0.4);
doc
  .strokeColor(ACCENT)
  .lineWidth(1.5)
  .moveTo(MARGIN.left, doc.y)
  .lineTo(MARGIN.left + maxW, doc.y)
  .stroke();
doc.moveDown(0.8);

for (let i = 0; i < lines.length; i++) {
  const raw = lines[i];
  const line = raw.replace(/\s+$/, "");
  const text = line.replace(/^\s{0,2}/, "");

  // Skip decorative banner lines made of = or -
  if (/^={5,}$/.test(text) || /^-{5,}$/.test(text)) {
    ensureSpace(16);
    doc.moveDown(0.35);
    const isHeavy = text.startsWith("=");
    doc
      .strokeColor(isHeavy ? ACCENT : RULE)
      .lineWidth(isHeavy ? 1 : 0.5)
      .moveTo(MARGIN.left, doc.y)
      .lineTo(MARGIN.left + maxW, doc.y)
      .stroke();
    doc.moveDown(0.45);
    continue;
  }

  if (text === "") {
    if (doc.y + 10 <= maxY) doc.moveDown(0.3);
    continue;
  }

  // All-caps section titles
  const upper = text.toUpperCase() === text && /[A-Z]/.test(text);
  const isSection =
    upper &&
    text.length < 72 &&
    !text.startsWith("*") &&
    !text.startsWith("[");

  if (isSection) {
    ensureSpace(32);
    doc.moveDown(0.35);
    doc
      .fillColor(FG)
      .font("Helvetica-Bold")
      .fontSize(text.startsWith("HOSTORA") ? 13 : 10.5)
      .text(text, { width: maxW });
    doc.moveDown(0.25);
    continue;
  }

  // Bullets / checklist
  if (text.startsWith("* ") || text.startsWith("[ ]") || text.startsWith("[x]")) {
    ensureSpace(20);
    const pretty = text
      .replace(/^\* /, "•  ")
      .replace(/^\[ \]/, "[ ] ")
      .replace(/^\[x\]/, "[x] ");
    doc
      .fillColor(MUTED)
      .font("Helvetica")
      .fontSize(9.5)
      .text(pretty, {
        width: maxW,
        indent: 6,
        lineGap: 1.5,
      });
    continue;
  }

  // Short bold labels (e.g. "WE SELL", "Talk track:")
  if (
    (text.endsWith(":") && text.length < 40) ||
    /^(WE SELL|WE DO NOT SELL|QUALIFIED|NOT QUALIFIED|IMPORTANT)$/.test(text)
  ) {
    ensureSpace(20);
    doc
      .fillColor(FG)
      .font("Helvetica-Bold")
      .fontSize(9.5)
      .text(text, { width: maxW });
    doc.moveDown(0.1);
    continue;
  }

  ensureSpace(18);
  doc
    .fillColor(MUTED)
    .font("Helvetica")
    .fontSize(9.5)
    .text(text, { width: maxW, lineGap: 1.5, align: "left" });
}

const pages = doc.bufferedPageRange().count;
if (pages < 1) {
  throw new Error("Sales rep manual PDF produced no pages");
}

doc.end();

await new Promise((resolve, reject) => {
  stream.on("finish", resolve);
  stream.on("error", reject);
});

console.log("Wrote", out, `(${pages} pages)`);
