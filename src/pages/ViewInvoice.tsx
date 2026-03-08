import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Download, CheckCircle2, Pencil, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface InvoiceItem {
  id: string;
  item_name: string;
  description: string | null;
  quantity: number;
  unit_price: number;
  line_total: number;
}

interface InvoiceDetail {
  id: string;
  invoice_number: string;
  status: string;
  issue_date: string;
  due_date: string | null;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  notes: string | null;
  customers: { name: string; email: string | null } | null;
}

const ViewInvoice = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<InvoiceDetail | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvoice = async () => {
    if (!id) return;
    const { data } = await supabase
      .from("invoices")
      .select("id, invoice_number, status, issue_date, due_date, subtotal, tax, discount, total, notes, customers(name, email)")
      .eq("id", id)
      .maybeSingle();
    setInvoice(data as any);

    const { data: lineItems } = await supabase
      .from("invoice_items")
      .select("*")
      .eq("invoice_id", id)
      .order("id");
    setItems((lineItems as any) || []);
    setLoading(false);
  };

  useEffect(() => { fetchInvoice(); }, [id]);

  const updateStatus = async (status: string, label: string) => {
    if (!id) return;
    const { error } = await supabase.from("invoices").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); } else { toast.success(`Marked as ${label}`); fetchInvoice(); }
  };

  const handleDownloadPDF = () => {
    if (!invoice) return;
    // Build a simple printable view and trigger browser print
    const printWindow = window.open("", "_blank");
    if (!printWindow) { toast.error("Please allow popups"); return; }

    const itemsHTML = items.map(i => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #eee">${i.item_name}</td>
        <td style="padding:8px;border-bottom:1px solid #eee">${i.description || ""}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${i.quantity}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">$${Number(i.unit_price).toFixed(2)}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">$${Number(i.line_total).toFixed(2)}</td>
      </tr>
    `).join("");

    printWindow.document.write(`
      <html><head><title>${invoice.invoice_number}</title>
      <style>body{font-family:system-ui,sans-serif;padding:40px;max-width:800px;margin:0 auto}
      table{width:100%;border-collapse:collapse}th{text-align:left;padding:8px;border-bottom:2px solid #333;font-size:13px}
      .summary{margin-top:24px;text-align:right}.summary div{margin:4px 0}h1{margin:0}
      @media print{body{padding:20px}}</style></head><body>
      <h1>${invoice.invoice_number}</h1>
      <p style="color:#666;margin-top:4px">Status: ${invoice.status}</p>
      <div style="display:flex;justify-content:space-between;margin:24px 0">
        <div><strong>Customer</strong><br/>${invoice.customers?.name || "—"}<br/>${invoice.customers?.email || ""}</div>
        <div style="text-align:right"><strong>Issue Date</strong><br/>${invoice.issue_date}<br/><strong>Due Date</strong><br/>${invoice.due_date || "—"}</div>
      </div>
      <table><thead><tr><th>Item</th><th>Description</th><th style="text-align:right">Qty</th><th style="text-align:right">Price</th><th style="text-align:right">Total</th></tr></thead>
      <tbody>${itemsHTML}</tbody></table>
      <div class="summary">
        <div>Subtotal: $${Number(invoice.subtotal).toFixed(2)}</div>
        <div>Tax: $${Number(invoice.tax).toFixed(2)}</div>
        ${invoice.discount > 0 ? `<div>Discount: -$${Number(invoice.discount).toFixed(2)}</div>` : ""}
        <div style="font-size:18px;font-weight:bold;margin-top:8px">Total: $${Number(invoice.total).toFixed(2)}</div>
      </div>
      ${invoice.notes ? `<div style="margin-top:32px;padding:16px;background:#f9f9f9;border-radius:8px"><strong>Notes</strong><p>${invoice.notes}</p></div>` : ""}
      <script>window.print();</script></body></html>
    `);
    printWindow.document.close();
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </AppLayout>
    );
  }

  if (!invoice) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Invoice not found.</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/invoices")}>Back to Invoices</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/invoices")}><ArrowLeft className="h-4 w-4" /></Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">{invoice.invoice_number}</h1>
              <StatusBadge status={invoice.status as any} />
            </div>
            <p className="text-muted-foreground">{invoice.customers?.name || "No customer"}</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/invoices/${invoice.id}/edit`}><Pencil className="mr-1 h-3.5 w-3.5" />Edit Invoice</Link>
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
            <Download className="mr-1 h-3.5 w-3.5" />Download PDF
          </Button>
          {invoice.status === "draft" && (
            <Button variant="outline" size="sm" onClick={() => updateStatus("sent", "sent")}>
              <Send className="mr-1 h-3.5 w-3.5" />Mark as Sent
            </Button>
          )}
          {invoice.status !== "paid" && (
            <Button size="sm" onClick={() => updateStatus("paid", "paid")}>
              <CheckCircle2 className="mr-1 h-3.5 w-3.5" />Mark as Paid
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="mb-4 font-semibold text-foreground">Details</h2>
            <div className="grid gap-4 sm:grid-cols-2 text-sm">
              <div><span className="text-muted-foreground">Customer</span><p className="font-medium text-foreground">{invoice.customers?.name || "—"}</p></div>
              <div><span className="text-muted-foreground">Email</span><p className="font-medium text-foreground">{invoice.customers?.email || "—"}</p></div>
              <div><span className="text-muted-foreground">Issue Date</span><p className="font-medium text-foreground">{invoice.issue_date}</p></div>
              <div><span className="text-muted-foreground">Due Date</span><p className="font-medium text-foreground">{invoice.due_date || "—"}</p></div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
            <div className="p-6 pb-0"><h2 className="font-semibold text-foreground">Line Items</h2></div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Description</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Qty</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Price</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{item.item_name}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{item.description || "—"}</td>
                      <td className="px-6 py-4 text-sm text-foreground text-right">{item.quantity}</td>
                      <td className="px-6 py-4 text-sm text-foreground text-right">${Number(item.unit_price).toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm font-medium text-foreground text-right">${Number(item.line_total).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {invoice.notes && (
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <h2 className="mb-2 font-semibold text-foreground">Notes</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{invoice.notes}</p>
            </div>
          )}
        </div>

        <div>
          <div className="sticky top-6 rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="mb-4 font-semibold text-foreground">Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="text-foreground">${Number(invoice.subtotal).toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span className="text-foreground">${Number(invoice.tax).toFixed(2)}</span></div>
              {invoice.discount > 0 && (
                <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span className="text-destructive">-${Number(invoice.discount).toFixed(2)}</span></div>
              )}
              <div className="flex justify-between border-t border-border pt-2 text-lg font-bold">
                <span className="text-foreground">Total</span>
                <span className="text-foreground">${Number(invoice.total).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ViewInvoice;
