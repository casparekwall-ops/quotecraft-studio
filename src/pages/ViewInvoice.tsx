import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Download, CheckCircle2, Pencil, Send, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageContext";
import { useBrandSettings } from "@/hooks/useBrandSettings";
import DocumentPreview from "@/components/DocumentPreview";

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
  const { t } = useLanguage();
  const { settings } = useBrandSettings();
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

  if (loading) {
    return <AppLayout><div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64 rounded-xl" /></div></AppLayout>;
  }

  if (!invoice) {
    return <AppLayout><div className="text-center py-12"><p className="text-muted-foreground">{t.invoices.invoiceNotFound}</p><Button variant="outline" className="mt-4" onClick={() => navigate("/invoices")}>{t.invoices.backToInvoices}</Button></div></AppLayout>;
  }

  const previewData = {
    type: "invoice" as const,
    number: invoice.invoice_number,
    status: invoice.status,
    issueDate: invoice.issue_date,
    dueDate: invoice.due_date || undefined,
    customerName: invoice.customers?.name,
    customerEmail: invoice.customers?.email || undefined,
    items: items.map(i => ({ name: i.item_name, description: i.description || undefined, quantity: i.quantity, unitPrice: i.unit_price, lineTotal: i.line_total })),
    subtotal: invoice.subtotal, tax: invoice.tax, discount: invoice.discount, total: invoice.total,
    notes: invoice.notes || undefined,
  };

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
            <p className="text-muted-foreground">{invoice.customers?.name || t.dashboard.noCustomer}</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/invoices/${invoice.id}/edit`}><Pencil className="mr-1 h-3.5 w-3.5" />{t.invoices.editInvoice}</Link>
          </Button>
          <DocumentPreview
            data={previewData}
            defaultTemplate={settings.default_invoice_template}
            trigger={<Button variant="outline" size="sm"><Eye className="mr-1 h-3.5 w-3.5" />{t.invoices.preview}</Button>}
          />
          {invoice.status === "draft" && (
            <Button variant="outline" size="sm" onClick={() => updateStatus("sent", "sent")}>
              <Send className="mr-1 h-3.5 w-3.5" />{t.invoices.markSent}
            </Button>
          )}
          {invoice.status !== "paid" && (
            <Button size="sm" onClick={() => updateStatus("paid", "paid")}>
              <CheckCircle2 className="mr-1 h-3.5 w-3.5" />{t.invoices.markPaid}
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="mb-4 font-semibold text-foreground">{t.invoices.details}</h2>
            <div className="grid gap-4 sm:grid-cols-2 text-sm">
              <div><span className="text-muted-foreground">{t.invoices.customer}</span><p className="font-medium text-foreground">{invoice.customers?.name || "—"}</p></div>
              <div><span className="text-muted-foreground">{t.invoices.email}</span><p className="font-medium text-foreground">{invoice.customers?.email || "—"}</p></div>
              <div><span className="text-muted-foreground">{t.invoices.issueDate}</span><p className="font-medium text-foreground">{invoice.issue_date}</p></div>
              <div><span className="text-muted-foreground">{t.invoices.dueDate}</span><p className="font-medium text-foreground">{invoice.due_date || "—"}</p></div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
            <div className="p-6 pb-0"><h2 className="font-semibold text-foreground">{t.invoices.lineItems}</h2></div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">{t.invoices.item}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">{t.invoices.description}</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">{t.invoices.qty}</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">{t.invoices.price}</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">{t.invoices.total}</th>
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
              <h2 className="mb-2 font-semibold text-foreground">{t.invoices.notes}</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{invoice.notes}</p>
            </div>
          )}
        </div>

        <div>
          <div className="sticky top-6 rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="mb-4 font-semibold text-foreground">{t.invoices.summary}</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">{t.invoices.subtotal}</span><span className="text-foreground">${Number(invoice.subtotal).toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{t.invoices.tax}</span><span className="text-foreground">${Number(invoice.tax).toFixed(2)}</span></div>
              {invoice.discount > 0 && (
                <div className="flex justify-between"><span className="text-muted-foreground">{t.invoices.discount}</span><span className="text-destructive">-${Number(invoice.discount).toFixed(2)}</span></div>
              )}
              <div className="flex justify-between border-t border-border pt-2 text-lg font-bold">
                <span className="text-foreground">{t.invoices.total}</span>
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
