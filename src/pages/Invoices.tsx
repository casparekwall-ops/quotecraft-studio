import { useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Receipt, Plus, Search } from "lucide-react";

const mockInvoices = [
  { id: "INV-001", customer: "Sarah Johnson", amount: "$4,250.00", status: "paid" as const, date: "Mar 5, 2026", due: "Mar 19, 2026" },
  { id: "INV-002", customer: "Tom Wilson", amount: "$3,100.00", status: "sent" as const, date: "Mar 2, 2026", due: "Mar 16, 2026" },
  { id: "INV-003", customer: "Lisa Park", amount: "$7,800.00", status: "overdue" as const, date: "Feb 28, 2026", due: "Mar 14, 2026" },
  { id: "INV-004", customer: "Mike Chen", amount: "$1,800.00", status: "draft" as const, date: "Mar 4, 2026", due: "Mar 18, 2026" },
];

const Invoices = () => {
  const [search, setSearch] = useState("");
  const filtered = mockInvoices.filter(
    (inv) => inv.customer.toLowerCase().includes(search.toLowerCase()) || inv.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Invoices</h1>
          <p className="text-muted-foreground">Manage your invoices and track payments.</p>
        </div>
        <Button size="sm" asChild>
          <Link to="/invoices/new">
            <Plus className="mr-1 h-4 w-4" />
            New Invoice
          </Link>
        </Button>
      </div>

      {mockInvoices.length === 0 ? (
        <EmptyState
          icon={<Receipt className="h-8 w-8" />}
          title="No invoices yet"
          description="Create your first invoice or convert an accepted quote."
          action={
            <Button asChild>
              <Link to="/invoices/new">
                <Plus className="mr-1 h-4 w-4" />
                Create Invoice
              </Link>
            </Button>
          }
        />
      ) : (
        <>
          <div className="mb-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search invoices..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Invoice</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Due</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((inv) => (
                    <tr key={inv.id} className="transition-colors hover:bg-muted/30 cursor-pointer">
                      <td className="px-6 py-4 text-sm font-medium text-primary">{inv.id}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{inv.customer}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{inv.date}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{inv.due}</td>
                      <td className="px-6 py-4 text-sm font-medium text-foreground text-right">{inv.amount}</td>
                      <td className="px-6 py-4"><StatusBadge status={inv.status} /></td>
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
