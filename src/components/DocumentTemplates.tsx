import { BrandSettings } from "@/hooks/useBrandSettings";
import { formatCurrency, CurrencyCode } from "@/lib/currency";

export type TemplateName = "minimal" | "classic" | "bold" | "elegant" | "compact";

export const TEMPLATE_LIST: TemplateName[] = ["minimal", "classic", "bold", "elegant", "compact"];

interface DocumentData {
  type: "quote" | "invoice";
  number: string;
  status: string;
  issueDate: string;
  dueDate?: string;
  expiryDate?: string;
  customerName?: string;
  customerEmail?: string;
  currency?: CurrencyCode;
  items: { name: string; description?: string; quantity: number; unitPrice: number; lineTotal: number }[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  notes?: string;
  terms?: string;
}

export function generateTemplateHTML(
  template: TemplateName,
  data: DocumentData,
  brand: BrandSettings
): string {
  const primary = brand.primary_color || "#6C47FF";
  const secondary = brand.secondary_color || "#EC4899";
  const isQuote = data.type === "quote";
  const cur = (data.currency || "USD") as CurrencyCode;
  const fc = (amount: number) => formatCurrency(amount, cur);

  const logoHTML = brand.logo_url
    ? `<img src="${brand.logo_url}" alt="Logo" style="max-height:60px;max-width:200px;object-fit:contain" />`
    : "";

  const companyBlock = `
    <div>
      ${logoHTML}
      <div style="margin-top:8px;font-weight:700;font-size:16px">${brand.company_name || ""}</div>
      ${brand.org_number ? `<div style="font-size:12px;color:#666">Org: ${brand.org_number}</div>` : ""}
      ${brand.company_address ? `<div style="font-size:12px;color:#666">${brand.company_address}</div>` : ""}
      ${brand.company_email ? `<div style="font-size:12px;color:#666">${brand.company_email}</div>` : ""}
      ${brand.company_phone ? `<div style="font-size:12px;color:#666">${brand.company_phone}</div>` : ""}
      ${brand.company_website ? `<div style="font-size:12px;color:#666">${brand.company_website}</div>` : ""}
    </div>
  `;

  const customerBlock = `
    <div>
      <div style="font-size:12px;color:#999;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">${isQuote ? "Quote To" : "Bill To"}</div>
      <div style="font-weight:600">${data.customerName || "—"}</div>
      ${data.customerEmail ? `<div style="font-size:13px;color:#666">${data.customerEmail}</div>` : ""}
    </div>
  `;

  const datesBlock = `
    <div style="text-align:right">
      <div style="font-size:12px;color:#999">Issue Date</div>
      <div style="font-weight:500">${data.issueDate}</div>
      ${data.dueDate ? `<div style="font-size:12px;color:#999;margin-top:8px">Due Date</div><div style="font-weight:500">${data.dueDate}</div>` : ""}
      ${data.expiryDate ? `<div style="font-size:12px;color:#999;margin-top:8px">Expiry Date</div><div style="font-weight:500">${data.expiryDate}</div>` : ""}
    </div>
  `;

  const itemRows = data.items.map(i => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0">${i.name}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;color:#666">${i.description || ""}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;text-align:right">${i.quantity}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;text-align:right">$${Number(i.unitPrice).toFixed(2)}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:500">$${Number(i.lineTotal).toFixed(2)}</td>
    </tr>
  `).join("");

  const summaryBlock = `
    <div style="margin-left:auto;width:260px">
      <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:14px"><span style="color:#666">Subtotal</span><span>$${Number(data.subtotal).toFixed(2)}</span></div>
      <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:14px"><span style="color:#666">Tax</span><span>$${Number(data.tax).toFixed(2)}</span></div>
      ${data.discount > 0 ? `<div style="display:flex;justify-content:space-between;padding:6px 0;font-size:14px"><span style="color:#666">Discount</span><span style="color:#e53e3e">-$${Number(data.discount).toFixed(2)}</span></div>` : ""}
      <div style="display:flex;justify-content:space-between;padding:10px 0;border-top:2px solid ${primary};margin-top:8px;font-size:18px;font-weight:700"><span>Total</span><span>$${Number(data.total).toFixed(2)}</span></div>
    </div>
  `;

  const footerBlock = brand.footer_text
    ? `<div style="margin-top:40px;padding:16px;background:#f9fafb;border-radius:8px;font-size:13px;color:#666;text-align:center">${brand.footer_text}</div>`
    : "";

  const notesBlock = data.notes
    ? `<div style="margin-top:24px;padding:16px;background:#f9fafb;border-radius:8px"><div style="font-weight:600;margin-bottom:6px;font-size:13px">Notes</div><div style="font-size:13px;color:#666;white-space:pre-wrap">${data.notes}</div></div>`
    : "";

  const termsBlock = data.terms
    ? `<div style="margin-top:12px;padding:16px;background:#f9fafb;border-radius:8px"><div style="font-weight:600;margin-bottom:6px;font-size:13px">Terms & Conditions</div><div style="font-size:13px;color:#666;white-space:pre-wrap">${data.terms}</div></div>`
    : "";

  const templates: Record<TemplateName, string> = {
    minimal: `
      <div style="font-family:system-ui,-apple-system,sans-serif;max-width:800px;margin:0 auto;padding:40px;color:#1a1a1a">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px">
          ${companyBlock}
          <div style="text-align:right">
            <div style="font-size:28px;font-weight:700;color:${primary}">${data.number}</div>
            <div style="font-size:13px;color:#999;margin-top:4px;text-transform:uppercase">${data.status}</div>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:32px">
          ${customerBlock}
          ${datesBlock}
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <thead><tr style="border-bottom:2px solid #e5e7eb">
            <th style="padding:10px 12px;text-align:left;font-size:12px;text-transform:uppercase;color:#999;font-weight:500">Item</th>
            <th style="padding:10px 12px;text-align:left;font-size:12px;text-transform:uppercase;color:#999;font-weight:500">Description</th>
            <th style="padding:10px 12px;text-align:right;font-size:12px;text-transform:uppercase;color:#999;font-weight:500">Qty</th>
            <th style="padding:10px 12px;text-align:right;font-size:12px;text-transform:uppercase;color:#999;font-weight:500">Price</th>
            <th style="padding:10px 12px;text-align:right;font-size:12px;text-transform:uppercase;color:#999;font-weight:500">Total</th>
          </tr></thead>
          <tbody>${itemRows}</tbody>
        </table>
        <div style="margin-top:24px">${summaryBlock}</div>
        ${notesBlock}${termsBlock}${footerBlock}
      </div>
    `,
    classic: `
      <div style="font-family:Georgia,'Times New Roman',serif;max-width:800px;margin:0 auto;padding:40px;color:#2d2d2d">
        <div style="border-bottom:3px double ${primary};padding-bottom:20px;margin-bottom:30px;display:flex;justify-content:space-between;align-items:flex-start">
          ${companyBlock}
          <div style="text-align:right">
            <div style="font-size:13px;text-transform:uppercase;letter-spacing:2px;color:${primary}">${isQuote ? "QUOTATION" : "INVOICE"}</div>
            <div style="font-size:24px;font-weight:700;margin-top:4px">${data.number}</div>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:32px">
          ${customerBlock}
          ${datesBlock}
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:14px;font-family:system-ui,sans-serif">
          <thead><tr style="background:${primary};color:white">
            <th style="padding:10px 12px;text-align:left;font-size:12px;text-transform:uppercase">Item</th>
            <th style="padding:10px 12px;text-align:left;font-size:12px;text-transform:uppercase">Description</th>
            <th style="padding:10px 12px;text-align:right;font-size:12px;text-transform:uppercase">Qty</th>
            <th style="padding:10px 12px;text-align:right;font-size:12px;text-transform:uppercase">Price</th>
            <th style="padding:10px 12px;text-align:right;font-size:12px;text-transform:uppercase">Total</th>
          </tr></thead>
          <tbody>${itemRows}</tbody>
        </table>
        <div style="margin-top:24px">${summaryBlock}</div>
        ${notesBlock}${termsBlock}${footerBlock}
      </div>
    `,
    bold: `
      <div style="font-family:system-ui,-apple-system,sans-serif;max-width:800px;margin:0 auto;padding:0;color:#1a1a1a">
        <div style="background:linear-gradient(135deg,${primary},${secondary});padding:40px;color:white">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <div>
              ${brand.logo_url ? `<img src="${brand.logo_url}" alt="Logo" style="max-height:50px;max-width:180px;object-fit:contain;filter:brightness(10)" />` : ""}
              <div style="margin-top:8px;font-weight:700;font-size:18px">${brand.company_name || ""}</div>
            </div>
            <div style="text-align:right">
              <div style="font-size:36px;font-weight:800">${data.number}</div>
              <div style="font-size:13px;opacity:0.8;text-transform:uppercase;letter-spacing:1px">${data.status}</div>
            </div>
          </div>
        </div>
        <div style="padding:40px">
          <div style="display:flex;justify-content:space-between;margin-bottom:32px">
            ${customerBlock}
            ${datesBlock}
          </div>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <thead><tr style="border-bottom:3px solid ${primary}">
              <th style="padding:10px 12px;text-align:left;font-size:11px;text-transform:uppercase;color:${primary};font-weight:700;letter-spacing:1px">Item</th>
              <th style="padding:10px 12px;text-align:left;font-size:11px;text-transform:uppercase;color:${primary};font-weight:700;letter-spacing:1px">Description</th>
              <th style="padding:10px 12px;text-align:right;font-size:11px;text-transform:uppercase;color:${primary};font-weight:700;letter-spacing:1px">Qty</th>
              <th style="padding:10px 12px;text-align:right;font-size:11px;text-transform:uppercase;color:${primary};font-weight:700;letter-spacing:1px">Price</th>
              <th style="padding:10px 12px;text-align:right;font-size:11px;text-transform:uppercase;color:${primary};font-weight:700;letter-spacing:1px">Total</th>
            </tr></thead>
            <tbody>${itemRows}</tbody>
          </table>
          <div style="margin-top:24px">${summaryBlock}</div>
          ${notesBlock}${termsBlock}${footerBlock}
        </div>
      </div>
    `,
    elegant: `
      <div style="font-family:'Segoe UI',system-ui,sans-serif;max-width:800px;margin:0 auto;padding:48px;color:#333;border:1px solid #e5e7eb">
        <div style="text-align:center;margin-bottom:40px;padding-bottom:24px;border-bottom:1px solid #e5e7eb">
          ${brand.logo_url ? `<div style="margin-bottom:12px">${logoHTML}</div>` : ""}
          <div style="font-size:20px;font-weight:600;letter-spacing:1px">${brand.company_name || ""}</div>
          ${brand.company_address ? `<div style="font-size:12px;color:#999;margin-top:4px">${brand.company_address}</div>` : ""}
        </div>
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:36px">
          <div>
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:${primary};font-weight:600">${isQuote ? "Quotation" : "Invoice"}</div>
            <div style="font-size:28px;font-weight:300;color:#333;margin-top:2px">${data.number}</div>
          </div>
          ${datesBlock}
        </div>
        <div style="margin-bottom:32px">${customerBlock}</div>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <thead><tr>
            <th style="padding:12px;text-align:left;border-bottom:1px solid ${primary};font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#999">Item</th>
            <th style="padding:12px;text-align:left;border-bottom:1px solid ${primary};font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#999">Description</th>
            <th style="padding:12px;text-align:right;border-bottom:1px solid ${primary};font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#999">Qty</th>
            <th style="padding:12px;text-align:right;border-bottom:1px solid ${primary};font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#999">Price</th>
            <th style="padding:12px;text-align:right;border-bottom:1px solid ${primary};font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#999">Total</th>
          </tr></thead>
          <tbody>${itemRows}</tbody>
        </table>
        <div style="margin-top:24px">${summaryBlock}</div>
        ${notesBlock}${termsBlock}${footerBlock}
      </div>
    `,
    compact: `
      <div style="font-family:system-ui,-apple-system,sans-serif;max-width:800px;margin:0 auto;padding:24px;color:#1a1a1a;font-size:13px">
        <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:12px;border-bottom:2px solid ${primary};margin-bottom:16px">
          <div style="display:flex;align-items:center;gap:12px">
            ${logoHTML}
            <div>
              <div style="font-weight:700;font-size:15px">${brand.company_name || ""}</div>
              ${brand.company_email ? `<div style="font-size:11px;color:#666">${brand.company_email}</div>` : ""}
            </div>
          </div>
          <div style="text-align:right">
            <div style="font-weight:700;font-size:16px;color:${primary}">${data.number}</div>
            <div style="font-size:11px;color:#999">${data.status.toUpperCase()}</div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;font-size:12px">
          <div><span style="color:#999">Customer:</span> ${data.customerName || "—"}</div>
          <div><span style="color:#999">Email:</span> ${data.customerEmail || "—"}</div>
          <div><span style="color:#999">Issue:</span> ${data.issueDate}</div>
          <div><span style="color:#999">${data.dueDate ? "Due:" : "Expiry:"}</span> ${data.dueDate || data.expiryDate || "—"}</div>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:12px">
          <thead><tr style="background:#f3f4f6">
            <th style="padding:6px 8px;text-align:left;font-weight:600">Item</th>
            <th style="padding:6px 8px;text-align:left;font-weight:600">Desc</th>
            <th style="padding:6px 8px;text-align:right;font-weight:600">Qty</th>
            <th style="padding:6px 8px;text-align:right;font-weight:600">Price</th>
            <th style="padding:6px 8px;text-align:right;font-weight:600">Total</th>
          </tr></thead>
          <tbody>${data.items.map(i => `
            <tr>
              <td style="padding:6px 8px;border-bottom:1px solid #f0f0f0">${i.name}</td>
              <td style="padding:6px 8px;border-bottom:1px solid #f0f0f0;color:#666">${i.description || ""}</td>
              <td style="padding:6px 8px;border-bottom:1px solid #f0f0f0;text-align:right">${i.quantity}</td>
              <td style="padding:6px 8px;border-bottom:1px solid #f0f0f0;text-align:right">$${Number(i.unitPrice).toFixed(2)}</td>
              <td style="padding:6px 8px;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:500">$${Number(i.lineTotal).toFixed(2)}</td>
            </tr>
          `).join("")}</tbody>
        </table>
        <div style="margin-top:16px;margin-left:auto;width:220px;font-size:12px">
          <div style="display:flex;justify-content:space-between;padding:4px 0"><span style="color:#666">Subtotal</span><span>$${Number(data.subtotal).toFixed(2)}</span></div>
          <div style="display:flex;justify-content:space-between;padding:4px 0"><span style="color:#666">Tax</span><span>$${Number(data.tax).toFixed(2)}</span></div>
          ${data.discount > 0 ? `<div style="display:flex;justify-content:space-between;padding:4px 0"><span style="color:#666">Discount</span><span style="color:#e53e3e">-$${Number(data.discount).toFixed(2)}</span></div>` : ""}
          <div style="display:flex;justify-content:space-between;padding:8px 0;border-top:2px solid ${primary};margin-top:4px;font-weight:700;font-size:14px"><span>Total</span><span>$${Number(data.total).toFixed(2)}</span></div>
        </div>
        ${data.notes ? `<div style="margin-top:16px;padding:10px;background:#f9fafb;border-radius:6px;font-size:11px;color:#666"><strong>Notes:</strong> ${data.notes}</div>` : ""}
        ${data.terms ? `<div style="margin-top:8px;padding:10px;background:#f9fafb;border-radius:6px;font-size:11px;color:#666"><strong>Terms:</strong> ${data.terms}</div>` : ""}
        ${brand.footer_text ? `<div style="margin-top:16px;text-align:center;font-size:11px;color:#999">${brand.footer_text}</div>` : ""}
      </div>
    `,
  };

  return templates[template] || templates.minimal;
}

export type { DocumentData };
