import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Plus, Search, ArrowRightLeft, Send, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface Quote {
  id: string;
  quote_number: string;
  status: string;
  issue_date: string;
  expiry_date: string | null;
  total: number;
  customers: { name: string } | null;
}

const Quotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchQuotes = async () => {
    const { data } = await supabase
      .from("quotes")
      .select("id, quote_number, status, issue_date, expiry_date, total, customers(name)")
      .order("created_at", { ascending: false });
    setQuotes((data as any) || []);
    setLoading(false);
  };

  useEffect(() => { fetchQuotes(); }, []);

  const convertToInvoice = async (quote: Quote) => {
    if (!user) return;
    // Get quote items
    const { data: quoteItems } = await supabase.from("quote_items").select("*").eq("quote_id", quote.id);
    // Generate invoice number
    const { count } = await supabase.from("invoices").select("*", { count: "exact", head: true });
    const invoiceNumber = `INV-${String((count || 0) + 1).padStart(3, "0")}`;

    // Get full quote data
    const { data: fullQuote } = await supabase.from("quotes").select("*").eq("id", quote.id).single();
    if (!fullQuote) return;

    const { data: invoice, error } = await supabase.from("invoices").insert({
      user_id: user.id,
      customer_id: fullQuote.customer_id,
      invoice_number: invoiceNumber,
      status: "draft",
      issue_date: new Date().toISOString().split("T")[0],
      due_date: null,
      subtotal: fullQuote.subtotal,
      tax: fullQuote.tax,
      discount: fullQuote.discount,
      total: fullQuote.total,
      notes: fullQuote.notes,
      quote_id: quote.id,
    }).select().single();

    if (error || !invoice) { toast.error("Failed to convert"); return; }

    if (quoteItems && quoteItems.length > 0) {
      await supabase.from("invoice_items").insert(
        quoteItems.map((qi) => ({
          invoice_id: invoice.id,
          item_name: qi.item_name,
          description: qi.description,
          quantity: qi.quantity,
          unit_price: qi.unit_price,
          line_total: qi.line_total,
        }))
      );
    }

    toast.success(`Invoice ${invoiceNumber} created from quote`);
    navigate("/invoices");
  };

  const filtered = quotes.filter(
    (q) => (q.customers?.name || "").toLowerCase().includes(search.toLowerCase()) || q.quote_number.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Quotes</h1>
          <p className="text-muted-foreground">Manage your quotes and proposals.</p>
        </div>
        <Button size="sm" asChild>
          <Link to="/quotes/new"><Plus className="mr-1 h-4 w-4" />New Quote</Link>
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 rounded-xl" />)}</div>
      ) : quotes.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-8 w-8" />}
          title="No quotes yet"
          description="Create your first quote to get started."
          action={<Button asChild><Link to="/quotes/new"><Plus className="mr-1 h-4 w-4" />Create Quote</Link></Button>}
        />
      ) : (
        <>
          <div className="mb-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search quotes..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Quote</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((q) => (
                    <tr key={q.id} className="transition-colors hover:bg-muted/30">
                      <td className="px-6 py-4 text-sm font-medium text-primary"><Link to={`/quotes/${q.id}`} className="hover:underline">{q.quote_number}</Link></td>
                      <td className="px-6 py-4 text-sm text-foreground">{q.customers?.name || "—"}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{q.issue_date}</td>
                      <td className="px-6 py-4 text-sm font-medium text-foreground text-right">${Number(q.total).toFixed(2)}</td>
                      <td className="px-6 py-4"><StatusBadge status={q.status as any} /></td>
                      <td className="px-6 py-4 text-right">
                        {q.status === "accepted" && (
                          <Button variant="outline" size="sm" onClick={() => convertToInvoice(q)}>
                            <ArrowRightLeft className="mr-1 h-3.5 w-3.5" />Convert to Invoice
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

export default Quotes;
