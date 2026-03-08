import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Receipt, Plus, Search, CheckCircle2, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageContext";

interface Invoice {
  id: string;
  invoice_number: string;
  status: string;
  issue_date: string;
  due_date: string | null;
  total: number;
  customers: { name: string } | null;
}

const Invoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { t } = useLanguage();

  const fetchInvoices = async () => {
    const { data } = await supabase
      .from("invoices")
      .select("id, invoice_number, status, issue_date, due_date, total, customers(name)")
      .order("created_at", { ascending: false });
    setInvoices((data as any) || []);
    setLoading(false);
  };

  useEffect(() => { fetchInvoices(); }, []);

  const updateStatus = async (id: string, status: string, label: string) => {
    const { error } = await supabase.from("invoices").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); } else { toast.success(`Marked as ${label}`); fetchInvoices(); }
  };

  const filtered = invoices.filter(
    (inv) => (inv.customers?.name || "").toLowerCase().includes(search.toLowerCase()) || inv.invoice_number.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t.invoices.title}</h1>
          <p className="text-muted-foreground">{t.invoices.subtitle}</p>
        </div>
        <Button size="sm" asChild>
          <Link to="/invoices/new"><Plus className="mr-1 h-4 w-4" />{t.invoices.newInvoice}</Link>
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 rounded-xl" />)}</div>
      ) : invoices.length === 0 ? (
        <EmptyState
          icon={<Receipt className="h-8 w-8" />}
          title={t.invoices.noInvoicesYet}
          description={t.invoices.noInvoicesDesc}
          action={<Button asChild><Link to="/invoices/new"><Plus className="mr-1 h-4 w-4" />{t.invoices.createInvoice}</Link></Button>}
        />
      ) : (
        <>
          <div className="mb-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder={t.invoices.searchInvoices} className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t.invoices.invoice}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t.invoices.customer}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t.invoices.date}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t.invoices.due}</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">{t.invoices.amount}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t.invoices.status}</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">{t.invoices.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((inv) => (
                    <tr key={inv.id} className="transition-colors hover:bg-muted/30">
                      <td className="px-6 py-4 text-sm font-medium text-primary"><Link to={`/invoices/${inv.id}`} className="hover:underline">{inv.invoice_number}</Link></td>
                      <td className="px-6 py-4 text-sm text-foreground">{inv.customers?.name || "—"}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{inv.issue_date}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{inv.due_date || "—"}</td>
                      <td className="px-6 py-4 text-sm font-medium text-foreground text-right">${Number(inv.total).toFixed(2)}</td>
                      <td className="px-6 py-4"><StatusBadge status={inv.status as any} /></td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {inv.status === "draft" && (
                          <Button variant="outline" size="sm" onClick={() => updateStatus(inv.id, "sent", "sent")}>
                            <Send className="mr-1 h-3.5 w-3.5" />{t.invoices.markSent}
                          </Button>
                        )}
                        {inv.status !== "paid" && (
                          <Button variant="outline" size="sm" onClick={() => updateStatus(inv.id, "paid", "paid")}>
                            <CheckCircle2 className="mr-1 h-3.5 w-3.5" />{t.invoices.markPaid}
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
};

export default Invoices;
