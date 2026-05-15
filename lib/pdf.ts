import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFImage, type PDFPage } from "pdf-lib";
import type { InvoiceWithItems, Profile } from "@/types/db";

const COLOR = {
  text: rgb(0.12, 0.16, 0.23),
  muted: rgb(0.42, 0.47, 0.54),
  line: rgb(0.86, 0.89, 0.92),
  brand: rgb(0.12, 0.24, 0.96),
  bg: rgb(0.96, 0.97, 1),
};

function fmtMoney(n: number, ccy: string) {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: ccy }).format(n);
  } catch {
    return `${ccy} ${n.toFixed(2)}`;
  }
}

function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export interface PdfOpts {
  profile?: Profile | null;
  logoBytes?: Uint8Array | null;
  fallbackName?: string;
  fallbackEmail?: string;
}

export async function renderInvoicePdf(
  invoice: InvoiceWithItems,
  opts: PdfOpts = {}
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]); // A4
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const { width, height } = page.getSize();
  const margin = 48;
  const ccy = invoice.currency || "USD";

  const sellerName =
    opts.profile?.business_name || opts.fallbackName || "Invoicely";
  const sellerEmail = opts.profile?.email || opts.fallbackEmail || "";

  // Try embed logo
  let logo: PDFImage | null = null;
  if (opts.logoBytes && opts.logoBytes.byteLength > 0) {
    try {
      logo = await pdf.embedPng(opts.logoBytes);
    } catch {
      try {
        logo = await pdf.embedJpg(opts.logoBytes);
      } catch {
        logo = null;
      }
    }
  }

  // Header band
  page.drawRectangle({ x: 0, y: height - 130, width, height: 130, color: COLOR.bg });

  if (logo) {
    const maxH = 60;
    const ratio = logo.width / logo.height;
    const h = Math.min(maxH, logo.height);
    const w = h * ratio;
    page.drawImage(logo, { x: margin, y: height - 90, width: w, height: h });
  } else {
    page.drawText(sellerName, {
      x: margin,
      y: height - 60,
      size: 16,
      font: bold,
      color: COLOR.text,
    });
  }

  // INVOICE label + number (right)
  drawRight(page, bold, "INVOICE", width - margin, height - 60, 24, COLOR.text);
  drawRight(page, font, invoice.invoice_number, width - margin, height - 82, 11, COLOR.muted);

  // Seller block (under header)
  let sy = height - 150;
  page.drawText("From", { x: margin, y: sy, size: 9, font: bold, color: COLOR.muted });
  sy -= 14;
  page.drawText(sellerName, { x: margin, y: sy, size: 11, font: bold, color: COLOR.text });
  sy -= 14;
  if (sellerEmail) {
    page.drawText(sellerEmail, { x: margin, y: sy, size: 10, font, color: COLOR.muted });
    sy -= 12;
  }
  if (opts.profile?.phone) {
    page.drawText(opts.profile.phone, { x: margin, y: sy, size: 10, font, color: COLOR.muted });
    sy -= 12;
  }
  if (opts.profile?.address) {
    sy = wrapText(page, font, opts.profile.address, margin, sy, 220, 10, COLOR.muted);
  }
  if (opts.profile?.tax_id) {
    page.drawText(`Tax ID: ${opts.profile.tax_id}`, {
      x: margin,
      y: sy,
      size: 9,
      font,
      color: COLOR.muted,
    });
    sy -= 12;
  }

  // Bill to (right column)
  const billX = width / 2 + 20;
  let by = height - 150;
  page.drawText("Bill to", { x: billX, y: by, size: 9, font: bold, color: COLOR.muted });
  by -= 14;
  page.drawText(invoice.client?.name ?? "—", {
    x: billX,
    y: by,
    size: 11,
    font: bold,
    color: COLOR.text,
  });
  by -= 14;
  if (invoice.client?.company) {
    page.drawText(invoice.client.company, { x: billX, y: by, size: 10, font, color: COLOR.text });
    by -= 12;
  }
  if (invoice.client?.email) {
    page.drawText(invoice.client.email, { x: billX, y: by, size: 10, font, color: COLOR.muted });
    by -= 12;
  }

  // Meta
  const metaTop = Math.min(sy, by) - 10;
  const metaRows: [string, string][] = [
    ["Issue date", fmtDate(invoice.issue_date)],
    ["Due date", fmtDate(invoice.due_date)],
    ["Status", invoice.status.toUpperCase()],
    ["Currency", ccy],
  ];
  metaRows.forEach(([label, value], i) => {
    const y = metaTop - i * 16;
    page.drawText(label, { x: margin, y, size: 9, font: bold, color: COLOR.muted });
    drawRight(page, font, value, width - margin, y, 10, COLOR.text);
  });

  // Items table
  const tableTop = metaTop - metaRows.length * 16 - 24;
  const colX = {
    desc: margin,
    qty: width - margin - 280,
    unit: width - margin - 180,
    total: width - margin,
  };

  page.drawLine({
    start: { x: margin, y: tableTop + 14 },
    end: { x: width - margin, y: tableTop + 14 },
    thickness: 1,
    color: COLOR.line,
  });
  page.drawText("Description", { x: colX.desc, y: tableTop, size: 9, font: bold, color: COLOR.muted });
  drawRight(page, bold, "Qty", colX.qty + 40, tableTop, 9, COLOR.muted);
  drawRight(page, bold, "Unit price", colX.unit + 80, tableTop, 9, COLOR.muted);
  drawRight(page, bold, "Total", colX.total, tableTop, 9, COLOR.muted);
  page.drawLine({
    start: { x: margin, y: tableTop - 8 },
    end: { x: width - margin, y: tableTop - 8 },
    thickness: 1,
    color: COLOR.line,
  });

  let y = tableTop - 26;
  invoice.items.forEach((it) => {
    page.drawText(truncate(it.description, 60), {
      x: colX.desc,
      y,
      size: 10,
      font,
      color: COLOR.text,
    });
    drawRight(page, font, String(Number(it.quantity)), colX.qty + 40, y, 10, COLOR.text);
    drawRight(page, font, fmtMoney(Number(it.unit_price), ccy), colX.unit + 80, y, 10, COLOR.text);
    drawRight(page, font, fmtMoney(Number(it.total_price), ccy), colX.total, y, 10, COLOR.text);
    y -= 20;
  });

  // Totals breakdown
  y -= 4;
  page.drawLine({
    start: { x: margin, y: y + 12 },
    end: { x: width - margin, y: y + 12 },
    thickness: 1,
    color: COLOR.line,
  });

  const subtotal = Number(invoice.subtotal ?? 0);
  const discount = Number(invoice.discount ?? 0);
  const taxRate = Number(invoice.tax_rate ?? 0);
  const taxAmount = Math.max(subtotal - discount, 0) * (taxRate / 100);
  const totalsX = width - margin - 200;

  drawRight(page, font, "Subtotal", totalsX + 120, y - 4, 10, COLOR.muted);
  drawRight(page, font, fmtMoney(subtotal, ccy), width - margin, y - 4, 10, COLOR.text);
  y -= 16;
  if (discount > 0) {
    drawRight(page, font, "Discount", totalsX + 120, y - 4, 10, COLOR.muted);
    drawRight(page, font, `-${fmtMoney(discount, ccy)}`, width - margin, y - 4, 10, COLOR.text);
    y -= 16;
  }
  if (taxRate > 0) {
    drawRight(page, font, `Tax (${taxRate}%)`, totalsX + 120, y - 4, 10, COLOR.muted);
    drawRight(page, font, fmtMoney(taxAmount, ccy), width - margin, y - 4, 10, COLOR.text);
    y -= 16;
  }
  page.drawLine({
    start: { x: totalsX, y: y + 4 },
    end: { x: width - margin, y: y + 4 },
    thickness: 1,
    color: COLOR.line,
  });
  drawRight(page, bold, "Total due", totalsX + 120, y - 14, 11, COLOR.muted);
  drawRight(page, bold, fmtMoney(Number(invoice.total_amount), ccy), width - margin, y - 14, 14, COLOR.brand);

  // Notes
  if (invoice.notes) {
    const notesY = y - 50;
    page.drawText("Notes", { x: margin, y: notesY, size: 9, font: bold, color: COLOR.muted });
    wrapText(page, font, invoice.notes, margin, notesY - 16, width - margin * 2, 10, COLOR.text);
  }

  // Footer
  page.drawText("Thank you for your business.", {
    x: margin,
    y: 40,
    size: 9,
    font,
    color: COLOR.muted,
  });

  return pdf.save();
}

function drawRight(
  page: PDFPage,
  font: PDFFont,
  text: string,
  rightX: number,
  y: number,
  size: number,
  color = COLOR.text
) {
  const w = font.widthOfTextAtSize(text, size);
  page.drawText(text, { x: rightX - w, y, size, font, color });
}

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

function wrapText(
  page: PDFPage,
  font: PDFFont,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  size: number,
  color = COLOR.text
): number {
  const words = text.split(/\s+/);
  let line = "";
  let cy = y;
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (font.widthOfTextAtSize(test, size) > maxWidth) {
      page.drawText(line, { x, y: cy, size, font, color });
      cy -= size + 4;
      line = w;
    } else {
      line = test;
    }
  }
  if (line) {
    page.drawText(line, { x, y: cy, size, font, color });
    cy -= size + 4;
  }
  return cy;
}
