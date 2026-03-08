import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Download, ArrowRightLeft, Send, Pencil, CheckCircle2, XCircle, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageContext";
import { useBrandSettings } from "@/hooks/useBrandSettings";
import DocumentPreview from "@/components/DocumentPreview";

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
  const { t } = useLanguage();
  const { settings } = useBrandSettings();
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
      user_id: user.id, customer_id: quote.customer_id, invoice_number: invoiceNumber,
      status: "draft", issue_date: new Date().toISOString().split("T")[0],
      subtotal: quote.subtotal, tax: quote.tax, discount: quote.discount,
      total: quote.total, notes: quote.notes, quote_id: quote.id,
    }).select().single();

    if (error || !invoice) { toast.error("Failed to convert"); return; }

    if (items.length > 0) {
      await supabase.from("invoice_items").insert(
        items.map((qi) => ({ invoice_id: invoice.id, item_name: qi.item_name, description: qi.description, quantity: qi.quantity, unit_price: qi.unit_price, line_total: qi.line_total }))
      );
    }

    toast.success(`Invoice ${invoiceNumber} created`);
    navigate(`/invoices/${invoice.id}`);
  };

  if (loading) {
    return <AppLayout><div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64 rounded-xl" /></div></AppLayout>;
  }

  if (!quote) {
    return <AppLayout><div className="text-center py-12"><p className="text-muted-foreground">{t.quotes.quoteNotFound}</p><Button variant="outline" className="mt-4" onClick={() => navigate("/quotes")}>{t.quotes.backToQuotes}</Button></div></AppLayout>;
  }

  const previewData = {
    type: "quote" as const,
    number: quote.quote_number,
    status: quote.status,
    issueDate: quote.issue_date,
    expiryDate: quote.expiry_date || undefined,
    customerName: quote.customers?.name,
    customerEmail: quote.customers?.email || undefined,
    items: items.map(i => ({ name: i.item_name, description: i.description || undefined, quantity: i.quantity, unitPrice: i.unit_price, lineTotal: i.line_total })),
    subtotal: quote.subtotal, tax: quote.tax, discount: quote.discount, total: quote.total,
    notes: quote.notes || undefined, terms: quote.terms || undefined,
  };

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
            <p className="text-muted-foreground">{quote.customers?.name || t.dashboard.noCustomer}</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/quotes/${quote.id}/edit`}><Pencil className="mr-1 h-3.5 w-3.5" />{t.quotes.editQuote}</Link>
          </Button>
          <DocumentPreview
            data={previewData}
            defaultTemplate={settings.default_quote_template}
            trigger={<Button variant="outline" size="sm"><Eye className="mr-1 h-3.5 w-3.5" />{t.quotes.preview}</Button>}
          />
          {quote.status === "draft" && (
            <Button variant="outline" size="sm" onClick={() => updateStatus("sent", "sent")}>
              <Send className="mr-1 h-3.5 w-3.5" />{t.quotes.sendQuote}
            </Button>
          )}
          {(quote.status === "sent" || quote.status === "draft") && (
            <Button variant="outline" size="sm" onClick={() => updateStatus("accepted", "accepted")}>
              <CheckCircle2 className="mr-1 h-3.5 w-3.5" />{t.quotes.markAccepted}
            </Button>
          )}
          {(quote.status === "sent" || quote.status === "draft") && (
            <Button variant="outline" size="sm" onClick={() => updateStatus("rejected", "rejected")}>
              <XCircle className="mr-1 h-3.5 w-3.5" />{t.quotes.markRejected}
            </Button>
          )}
          {quote.status === "accepted" && (
            <Button size="sm" onClick={convertToInvoice}>
              <ArrowRightLeft className="mr-1 h-3.5 w-3.5" />{t.quotes.convertToInvoice}
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="mb-4 font-semibold text-foreground">{t.quotes.details}</h2>
            <div className="grid gap-4 sm:grid-cols-2 text-sm">
              <div><span className="text-muted-foreground">{t.quotes.customer}</span><p className="font-medium text-foreground">{quote.customers?.name || "—"}</p></div>
              <div><span className="text-muted-foreground">{t.quotes.email}</span><p className="font-medium text-foreground">{quote.customers?.email || "—"}</p></div>
              <div><span className="text-muted-foreground">{t.quotes.issueDate}</span><p className="font-medium text-foreground">{quote.issue_date}</p></div>
              <div><span className="text-muted-foreground">{t.quotes.expiryDate}</span><p className="font-medium text-foreground">{quote.expiry_date || "—"}</p></div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
            <div className="p-6 pb-0"><h2 className="font-semibold text-foreground">{t.quotes.lineItems}</h2></div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">{t.quotes.item}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">{t.quotes.description}</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">{t.quotes.qty}</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">{t.quotes.price}</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">{t.quotes.total}</th>
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
              <h2 className="mb-2 font-semibold text-foreground">{t.quotes.notes}</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{quote.notes}</p>
            </div>
          )}

          {quote.terms && (
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <h2 className="mb-2 font-semibold text-foreground">{t.quotes.termsAndConditions}</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{quote.terms}</p>
            </div>
          )}
        </div>

        <div>
          <div className="sticky top-6 rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="mb-4 font-semibold text-foreground">{t.quotes.summary}</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">{t.quotes.subtotal}</span><span className="text-foreground">${Number(quote.subtotal).toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{t.quotes.tax}</span><span className="text-foreground">${Number(quote.tax).toFixed(2)}</span></div>
              {quote.discount > 0 && (
                <div className="flex justify-between"><span className="text-muted-foreground">{t.quotes.discount}</span><span className="text-destructive">-${Number(quote.discount).toFixed(2)}</span></div>
              )}
              <div className="flex justify-between border-t border-border pt-2 text-lg font-bold">
                <span className="text-foreground">{t.quotes.total}</span>
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
