import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Download, ArrowRightLeft, Send, Pencil, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface QuoteItem {
  id: string;
  item_name: string;
  description: string | null;
  quantity: number;
  unit_price: number;
  line_total: number;
}

interface QuoteDetail {
  id: string;
  quote_number: string;
  status: string;
  issue_date: string;
  expiry_date: string | null;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  notes: string | null;
  terms: string | null;
  customer_id: string | null;
  customers: { name: string; email: string | null } | null;
}

const ViewQuote = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quote, setQuote] = useState<QuoteDetail | null>(null);
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuote = async () => {
    if (!id) return;
    const { data } = await supabase
      .from("quotes")
      .select("id, quote_number, status, issue_date, expiry_date, subtotal, tax, discount, total, notes, terms, customer_id, customers(name, email)")
      .eq("id", id)
      .maybeSingle();
    setQuote(data as any);

    const { data: lineItems } = await supabase
      .from("quote_items")
      .select("*")
      .eq("quote_id", id)
      .order("id");
    setItems((lineItems as any) || []);
    setLoading(false);
  };

  useEffect(() => { fetchQuote(); }, [id]);

  const updateStatus = async (status: string, label: string) => {
    if (!id) return;
    const { error } = await supabase.from("quotes").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); } else { toast.success(`Marked as ${label}`); fetchQuote(); }
  };

  const convertToInvoice = async () => {
    if (!user || !quote) return;
    const { count } = await supabase.from("invoices").select("*", { count: "exact", head: true });
    const invoiceNumber = `INV-${String((count || 0) + 1).padStart(3, "0")}`;

    const { data: invoice, error } = await supabase.from("invoices").insert({
      user_id: user.id,
      customer_id: quote.customer_id,
      invoice_number: invoiceNumber,
      status: "draft",
      issue_date: new Date().toISOString().split("T")[0],
      subtotal: quote.subtotal,
      tax: quote.tax,
      discount: quote.discount,
      total: quote.total,
      notes: quote.notes,
      quote_id: quote.id,
    }).select().single();

    if (error || !invoice) { toast.error("Failed to convert"); return; }

    if (items.length > 0) {
      await supabase.from("invoice_items").insert(
        items.map((qi) => ({
          invoice_id: invoice.id,
          item_name: qi.item_name,
          description: qi.description,
          quantity: qi.quantity,
          unit_price: qi.unit_price,
          line_total: qi.line_total,
        }))
      );
    }

    toast.success(`Invoice ${invoiceNumber} created`);
    navigate(`/invoices/${invoice.id}`);
  };

  const handleDownloadPDF = () => {
    if (!quote) return;
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
      <html><head><title>${quote.quote_number}</title>
      <style>body{font-family:system-ui,sans-serif;padding:40px;max-width:800px;margin:0 auto}
      table{width:100%;border-collapse:collapse}th{text-align:left;padding:8px;border-bottom:2px solid #333;font-size:13px}
      .summary{margin-top:24px;text-align:right}.summary div{margin:4px 0}h1{margin:0}
      @media print{body{padding:20px}}</style></head><body>
      <h1>${quote.quote_number}</h1>
      <p style="color:#666;margin-top:4px">Status: ${quote.status}</p>
      <div style="display:flex;justify-content:space-between;margin:24px 0">
        <div><strong>Customer</strong><br/>${quote.customers?.name || "—"}<br/>${quote.customers?.email || ""}</div>
        <div style="text-align:right"><strong>Issue Date</strong><br/>${quote.issue_date}<br/><strong>Expiry</strong><br/>${quote.expiry_date || "—"}</div>
      </div>
      <table><thead><tr><th>Item</th><th>Description</th><th style="text-align:right">Qty</th><th style="text-align:right">Price</th><th style="text-align:right">Total</th></tr></thead>
      <tbody>${itemsHTML}</tbody></table>
      <div class="summary">
        <div>Subtotal: $${Number(quote.subtotal).toFixed(2)}</div>
        <div>Tax: $${Number(quote.tax).toFixed(2)}</div>
        ${quote.discount > 0 ? `<div>Discount: -$${Number(quote.discount).toFixed(2)}</div>` : ""}
        <div style="font-size:18px;font-weight:bold;margin-top:8px">Total: $${Number(quote.total).toFixed(2)}</div>
      </div>
      ${quote.notes ? `<div style="margin-top:32px;padding:16px;background:#f9f9f9;border-radius:8px"><strong>Notes</strong><p>${quote.notes}</p></div>` : ""}
      ${quote.terms ? `<div style="margin-top:16px;padding:16px;background:#f9f9f9;border-radius:8px"><strong>Terms</strong><p>${quote.terms}</p></div>` : ""}
      <script>window.print();</script></body></html>
    `);
    printWindow.document.close();
  };

  if (loading) {
    return <AppLayout><div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64 rounded-xl" /></div></AppLayout>;
  }

  if (!quote) {
    return <AppLayout><div className="text-center py-12"><p className="text-muted-foreground">Quote not found.</p><Button variant="outline" className="mt-4" onClick={() => navigate("/quotes")}>Back to Quotes</Button></div></AppLayout>;
  }

  return (
    <AppLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/quotes")}><ArrowLeft className="h-4 w-4" /></Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">{quote.quote_number}</h1>
              <StatusBadge status={quote.status as any} />
            </div>
            <p className="text-muted-foreground">{quote.customers?.name || "No customer"}</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/quotes/${quote.id}/edit`}><Pencil className="mr-1 h-3.5 w-3.5" />Edit Quote</Link>
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
            <Download className="mr-1 h-3.5 w-3.5" />Download PDF
          </Button>
          {quote.status === "draft" && (
            <Button variant="outline" size="sm" onClick={() => updateStatus("sent", "sent")}>
              <Send className="mr-1 h-3.5 w-3.5" />Send Quote
            </Button>
          )}
          {(quote.status === "sent" || quote.status === "draft") && (
            <Button variant="outline" size="sm" onClick={() => updateStatus("accepted", "accepted")}>
              <CheckCircle2 className="mr-1 h-3.5 w-3.5" />Mark Accepted
            </Button>
          )}
          {(quote.status === "sent" || quote.status === "draft") && (
            <Button variant="outline" size="sm" onClick={() => updateStatus("rejected", "rejected")}>
              <XCircle className="mr-1 h-3.5 w-3.5" />Mark Rejected
            </Button>
          )}
          {quote.status === "accepted" && (
            <Button size="sm" onClick={convertToInvoice}>
              <ArrowRightLeft className="mr-1 h-3.5 w-3.5" />Convert to Invoice
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="mb-4 font-semibold text-foreground">Details</h2>
            <div className="grid gap-4 sm:grid-cols-2 text-sm">
              <div><span className="text-muted-foreground">Customer</span><p className="font-medium text-foreground">{quote.customers?.name || "—"}</p></div>
              <div><span className="text-muted-foreground">Email</span><p className="font-medium text-foreground">{quote.customers?.email || "—"}</p></div>
              <div><span className="text-muted-foreground">Issue Date</span><p className="font-medium text-foreground">{quote.issue_date}</p></div>
              <div><span className="text-muted-foreground">Expiry Date</span><p className="font-medium text-foreground">{quote.expiry_date || "—"}</p></div>
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

          {quote.notes && (
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <h2 className="mb-2 font-semibold text-foreground">Notes</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{quote.notes}</p>
            </div>
          )}

          {quote.terms && (
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <h2 className="mb-2 font-semibold text-foreground">Terms & Conditions</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{quote.terms}</p>
            </div>
          )}
        </div>

        <div>
          <div className="sticky top-6 rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="mb-4 font-semibold text-foreground">Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="text-foreground">${Number(quote.subtotal).toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span className="text-foreground">${Number(quote.tax).toFixed(2)}</span></div>
              {quote.discount > 0 && (
                <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span className="text-destructive">-${Number(quote.discount).toFixed(2)}</span></div>
              )}
              <div className="flex justify-between border-t border-border pt-2 text-lg font-bold">
                <span className="text-foreground">Total</span>
                <span className="text-foreground">${Number(quote.total).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ViewQuote;
