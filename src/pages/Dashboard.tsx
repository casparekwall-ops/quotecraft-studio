import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  FileText, Receipt, CheckCircle2, DollarSign, Plus, Users, ArrowRight,
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ quotes: 0, invoices: 0, accepted: 0, revenue: 0 });
  const [recentQuotes, setRecentQuotes] = useState<any[]>([]);
  const [recentInvoices, setRecentInvoices] = useState<any[]>([]);

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "there";

  useEffect(() => {
    const fetchData = async () => {
      const [quotesRes, invoicesRes, acceptedRes, paidRes, rqRes, riRes] = await Promise.all([
        supabase.from("quotes").select("*", { count: "exact", head: true }),
        supabase.from("invoices").select("*", { count: "exact", head: true }),
        supabase.from("quotes").select("*", { count: "exact", head: true }).eq("status", "accepted"),
        supabase.from("invoices").select("total").eq("status", "paid"),
        supabase.from("quotes").select("id, quote_number, status, total, issue_date, customers(name)").order("created_at", { ascending: false }).limit(3),
        supabase.from("invoices").select("id, invoice_number, status, total, issue_date, customers(name)").order("created_at", { ascending: false }).limit(3),
      ]);

      const revenue = (paidRes.data || []).reduce((sum, inv) => sum + Number(inv.total), 0);
      setStats({
        quotes: quotesRes.count || 0,
        invoices: invoicesRes.count || 0,
        accepted: acceptedRes.count || 0,
        revenue,
      });
      setRecentQuotes(rqRes.data || []);
      setRecentInvoices(riRes.data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <AppLayout>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {displayName}.</p>
        </div>
        <div className="flex gap-3">
          <Button size="sm" asChild><Link to="/quotes/new"><Plus className="mr-1 h-4 w-4" />New Quote</Link></Button>
          <Button size="sm" variant="outline" asChild><Link to="/invoices/new"><Plus className="mr-1 h-4 w-4" />New Invoice</Link></Button>
        </div>
      </div>

      {loading ? (
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      ) : (
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Quotes" value={String(stats.quotes)} icon={<FileText className="h-4 w-4 text-violet-500" />} gradient="from-violet-500/5 to-purple-500/5" />
          <StatCard title="Total Invoices" value={String(stats.invoices)} icon={<Receipt className="h-4 w-4 text-cyan-500" />} gradient="from-cyan-500/5 to-blue-500/5" />
          <StatCard title="Accepted Quotes" value={String(stats.accepted)} icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />} subtitle={stats.quotes ? `${Math.round((stats.accepted / stats.quotes) * 100)}% acceptance rate` : undefined} gradient="from-emerald-500/5 to-green-500/5" />
          <StatCard title="Revenue" value={`$${stats.revenue.toLocaleString()}`} icon={<DollarSign className="h-4 w-4 text-amber-500" />} subtitle="from paid invoices" gradient="from-amber-500/5 to-orange-500/5" />
        </div>
      )}

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Link to="/quotes/new" className="flex items-center gap-3 rounded-xl border border-border bg-gradient-to-br from-violet-500/5 to-purple-500/5 p-4 shadow-card transition-all hover:shadow-soft hover:-translate-y-0.5">
          <div className="rounded-lg bg-violet-500/10 p-2.5 text-violet-500"><FileText className="h-5 w-5" /></div>
          <div className="flex-1"><div className="text-sm font-semibold text-foreground">New Quote</div><div className="text-xs text-muted-foreground">Create a new quote</div></div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </Link>
        <Link to="/invoices/new" className="flex items-center gap-3 rounded-xl border border-border bg-gradient-to-br from-cyan-500/5 to-blue-500/5 p-4 shadow-card transition-all hover:shadow-soft hover:-translate-y-0.5">
          <div className="rounded-lg bg-cyan-500/10 p-2.5 text-cyan-500"><Receipt className="h-5 w-5" /></div>
          <div className="flex-1"><div className="text-sm font-semibold text-foreground">New Invoice</div><div className="text-xs text-muted-foreground">Create a new invoice</div></div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </Link>
        <Link to="/customers/new" className="flex items-center gap-3 rounded-xl border border-border bg-gradient-to-br from-pink-500/5 to-rose-500/5 p-4 shadow-card transition-all hover:shadow-soft hover:-translate-y-0.5">
          <div className="rounded-lg bg-pink-500/10 p-2.5 text-pink-500"><Users className="h-5 w-5" /></div>
          <div className="flex-1"><div className="text-sm font-semibold text-foreground">Add Customer</div><div className="text-xs text-muted-foreground">Add a new customer</div></div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card shadow-card">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="font-semibold text-foreground">Recent Quotes</h2>
            <Button variant="ghost" size="sm" asChild><Link to="/quotes">View all</Link></Button>
          </div>
          <div className="divide-y divide-border">
            {recentQuotes.length === 0 ? (
              <div className="px-6 py-8 text-center text-sm text-muted-foreground">No quotes yet</div>
            ) : recentQuotes.map((q: any) => (
              <div key={q.id} className="flex items-center justify-between px-6 py-3.5">
                <div>
                  <div className="text-sm font-medium text-foreground">{q.customers?.name || "No customer"}</div>
                  <div className="text-xs text-muted-foreground">{q.quote_number} · {q.issue_date}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground">${Number(q.total).toFixed(2)}</span>
                  <StatusBadge status={q.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card shadow-card">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="font-semibold text-foreground">Recent Invoices</h2>
            <Button variant="ghost" size="sm" asChild><Link to="/invoices">View all</Link></Button>
          </div>
          <div className="divide-y divide-border">
            {recentInvoices.length === 0 ? (
              <div className="px-6 py-8 text-center text-sm text-muted-foreground">No invoices yet</div>
            ) : recentInvoices.map((inv: any) => (
              <div key={inv.id} className="flex items-center justify-between px-6 py-3.5">
                <div>
                  <div className="text-sm font-medium text-foreground">{inv.customers?.name || "No customer"}</div>
                  <div className="text-xs text-muted-foreground">{inv.invoice_number} · {inv.issue_date}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground">${Number(inv.total).toFixed(2)}</span>
                  <StatusBadge status={inv.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
