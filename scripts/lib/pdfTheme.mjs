/**
 * PDFKit helpers so every page keeps the dark Hostora background.
 * Without pageAdded painting, overflow pages stay white and cream text vanishes.
 */
import { brand, colorsHex } from "./brand.mjs";

/**
 * @param {import("pdfkit")} doc
 * @param {{ margin?: number, footerLine?: string }} [opts]
 */
export function attachBrandPages(doc, opts = {}) {
  const M = opts.margin ?? 48;
  const footerLine =
    opts.footerLine ??
    `${brand.product}  ·  ${brand.legalName}  ·  ${brand.site}`;

  function paintBg() {
    doc.save();
    doc.rect(0, 0, doc.page.width, doc.page.height).fill(colorsHex.bg);
    doc.restore();
  }

  function footer() {
    // Keep Y above PDFKit’s bottom margin or .text() auto-adds a white page.
    const bottomMargin = doc.page.margins?.bottom ?? 36;
    const fy = doc.page.height - bottomMargin - 10;
    const contentW = doc.page.width - M * 2;
    doc
      .fillColor(colorsHex.muted)
      .fontSize(8)
      .font("Helvetica")
      .text(footerLine, M, fy, {
        width: contentW,
        align: "left",
        lineBreak: false,
      });
  }

  // First page already exists when PDFDocument is constructed
  paintBg();
  footer();

  doc.on("pageAdded", () => {
    paintBg();
    footer();
  });

  return {
    paintBg,
    footer,
    margin: M,
    colors: colorsHex,
    brand,
    bottomLimit: () => {
      const bottomMargin = doc.page.margins?.bottom ?? 36;
      return doc.page.height - bottomMargin - 16;
    },
    contentWidth: () => doc.page.width - M * 2,
    /** @param {number} y current y @param {number} need height needed */
    ensureSpace(y, need) {
      const bottom = doc.page.height - (doc.page.margins?.bottom ?? 36) - 16;
      if (y + need <= bottom) return y;
      doc.addPage();
      return M;
    },
  };
}

/** Draw text without allowing PDFKit to auto-paginate (throws if it would). */
export function textNoWrapPage(doc, str, x, y, options = {}) {
  const before = doc.bufferedPageRange
    ? doc.bufferedPageRange().count
    : undefined;
  const startPage = doc.page;
  doc.text(str, x, y, { ...options, lineBreak: options.lineBreak !== false });
  // If PDFKit advanced to a new page mid-text, we cannot safely recover layout
  if (doc.page !== startPage) {
    throw new Error(
      `PDF text overflowed onto a new page at y=${y}: "${String(str).slice(0, 60)}…" — tighten layout.`,
    );
  }
  return doc.y;
}
