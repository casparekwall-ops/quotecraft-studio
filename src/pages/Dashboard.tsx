import { Link } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Receipt,
  CheckCircle2,
  DollarSign,
  Plus,
  Users,
  ArrowRight,
} from "lucide-react";

const recentQuotes = [
  { id: "QT-001", customer: "Sarah Johnson", amount: "$4,250.00", status: "accepted" as const, date: "Mar 5, 2026" },
  { id: "QT-002", customer: "Mike Chen", amount: "$1,800.00", status: "sent" as const, date: "Mar 4, 2026" },
  { id: "QT-003", customer: "Emily Davis", amount: "$12,500.00", status: "draft" as const, date: "Mar 3, 2026" },
];

const recentInvoices = [
  { id: "INV-001", customer: "Sarah Johnson", amount: "$4,250.00", status: "paid" as const, date: "Mar 5, 2026" },
  { id: "INV-002", customer: "Tom Wilson", amount: "$3,100.00", status: "sent" as const, date: "Mar 2, 2026" },
  { id: "INV-003", customer: "Lisa Park", amount: "$7,800.00", status: "overdue" as const, date: "Feb 28, 2026" },
];

const Dashboard = () => {
  return (
    <AppLayout>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, John.</p>
        </div>
        <div className="flex gap-3">
          <Button size="sm" asChild>
            <Link to="/quotes/new">
              <Plus className="mr-1 h-4 w-4" />
              New Quote
            </Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link to="/invoices/new">
              <Plus className="mr-1 h-4 w-4" />
              New Invoice
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Quotes" value="24" icon={<FileText className="h-4 w-4" />} trend="+12%" subtitle="vs last month" />
        <StatCard title="Total Invoices" value="18" icon={<Receipt className="h-4 w-4" />} trend="+8%" subtitle="vs last month" />
        <StatCard title="Accepted Quotes" value="16" icon={<CheckCircle2 className="h-4 w-4" />} subtitle="66% acceptance rate" />
        <StatCard title="Revenue" value="$48,200" icon={<DollarSign className="h-4 w-4" />} trend="+22%" subtitle="this month" />
      </div>

      {/* Quick actions */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Link to="/quotes/new" className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-card transition-all hover:shadow-soft">
          <div className="rounded-lg bg-primary/10 p-2.5 text-primary"><FileText className="h-5 w-5" /></div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-foreground">New Quote</div>
            <div className="text-xs text-muted-foreground">Create a new quote</div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </Link>
        <Link to="/invoices/new" className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-card transition-all hover:shadow-soft">
          <div className="rounded-lg bg-success/10 p-2.5 text-success"><Receipt className="h-5 w-5" /></div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-foreground">New Invoice</div>
            <div className="text-xs text-muted-foreground">Create a new invoice</div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </Link>
        <Link to="/customers/new" className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-card transition-all hover:shadow-soft">
          <div className="rounded-lg bg-warning/10 p-2.5 text-warning"><Users className="h-5 w-5" /></div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-foreground">Add Customer</div>
            <div className="text-xs text-muted-foreground">Add a new customer</div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      </div>

      {/* Recent tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Quotes */}
        <div className="rounded-xl border border-border bg-card shadow-card">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="font-semibold text-foreground">Recent Quotes</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/quotes">View all</Link>
            </Button>
          </div>
          <div className="divide-y divide-border">
            {recentQuotes.map((q) => (
              <div key={q.id} className="flex items-center justify-between px-6 py-3.5">
                <div>
                  <div className="text-sm font-medium text-foreground">{q.customer}</div>
                  <div className="text-xs text-muted-foreground">{q.id} · {q.date}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground">{q.amount}</span>
                  <StatusBadge status={q.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="rounded-xl border border-border bg-card shadow-card">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="font-semibold text-foreground">Recent Invoices</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/invoices">View all</Link>
            </Button>
          </div>
          <div className="divide-y divide-border">
            {recentInvoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between px-6 py-3.5">
                <div>
                  <div className="text-sm font-medium text-foreground">{inv.customer}</div>
                  <div className="text-xs text-muted-foreground">{inv.id} · {inv.date}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground">{inv.amount}</span>
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
