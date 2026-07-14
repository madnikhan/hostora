/**
 * Print Hostora-Sales-Rep-Manual.txt as a clean light PDF.
 * Little design: white paper, amber top rule, Helvetica body, page footer.
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

const MARGIN = { top: 50, bottom: 50, left: 52, right: 52 };
const FG = "#222222";
const MUTED = "#444444";
const ACCENT = "#B8860B";
const RULE = "#E0E0E0";

const doc = new PDFDocument({
  size: "A4",
  margins: MARGIN,
  info: {
    Title: `${brand.product} Sales Representative Manual`,
    Author: brand.legalName,
  },
});

const stream = fs.createWriteStream(out);
doc.pipe(stream);

const maxW = doc.page.width - MARGIN.left - MARGIN.right;
const maxY = doc.page.height - MARGIN.bottom - 12;

function drawFooter() {
  const y = doc.page.height - 36;
  doc
    .strokeColor(RULE)
    .lineWidth(0.5)
    .moveTo(MARGIN.left, y - 6)
    .lineTo(doc.page.width - MARGIN.right, y - 6)
    .stroke();
  doc
    .fillColor("#777777")
    .font("Helvetica")
    .fontSize(8)
    .text(
      `${brand.product}  |  Sales Rep Manual  |  ${brand.legalName}  |  Page ${doc.page.number}`,
      MARGIN.left,
      y,
      { width: maxW, lineBreak: false },
    );
}

function ensureSpace(h) {
  if (doc.y + h > maxY) {
    doc.addPage();
    drawFooter();
    doc.y = MARGIN.top;
  }
}

drawFooter();
doc.y = MARGIN.top;

// Small header band
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
    doc.moveDown(0.3);
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

  // Bullets
  if (text.startsWith("* ") || text.startsWith("[ ]") || text.startsWith("[x]")) {
    ensureSpace(20);
    doc
      .fillColor(MUTED)
      .font("Helvetica")
      .fontSize(9.5)
      .text(text.replace(/^\* /, "•  ").replace(/^\[ \]/, "☐ ").replace(/^\[x\]/, "☑ "), {
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

doc.end();

await new Promise((resolve, reject) => {
  stream.on("finish", resolve);
  stream.on("error", reject);
});

console.log("Wrote", out);
