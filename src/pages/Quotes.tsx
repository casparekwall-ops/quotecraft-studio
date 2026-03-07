import { useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Plus, Search } from "lucide-react";

const mockQuotes = [
  { id: "QT-001", customer: "Sarah Johnson", amount: "$4,250.00", status: "accepted" as const, date: "Mar 5, 2026", expiry: "Mar 19, 2026" },
  { id: "QT-002", customer: "Mike Chen", amount: "$1,800.00", status: "sent" as const, date: "Mar 4, 2026", expiry: "Mar 18, 2026" },
  { id: "QT-003", customer: "Emily Davis", amount: "$12,500.00", status: "draft" as const, date: "Mar 3, 2026", expiry: "Mar 17, 2026" },
  { id: "QT-004", customer: "Tom Wilson", amount: "$3,400.00", status: "rejected" as const, date: "Mar 1, 2026", expiry: "Mar 15, 2026" },
  { id: "QT-005", customer: "Lisa Park", amount: "$8,900.00", status: "accepted" as const, date: "Feb 28, 2026", expiry: "Mar 14, 2026" },
];

const Quotes = () => {
  const [search, setSearch] = useState("");
  const filtered = mockQuotes.filter(
    (q) => q.customer.toLowerCase().includes(search.toLowerCase()) || q.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Quotes</h1>
          <p className="text-muted-foreground">Manage your quotes and proposals.</p>
        </div>
        <Button size="sm" asChild>
          <Link to="/quotes/new">
            <Plus className="mr-1 h-4 w-4" />
            New Quote
          </Link>
        </Button>
      </div>

      {mockQuotes.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-8 w-8" />}
          title="No quotes yet"
          description="Create your first quote to get started."
          action={
            <Button asChild>
              <Link to="/quotes/new">
                <Plus className="mr-1 h-4 w-4" />
                Create Quote
              </Link>
            </Button>
          }
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Expiry</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((q) => (
                    <tr key={q.id} className="transition-colors hover:bg-muted/30 cursor-pointer">
                      <td className="px-6 py-4 text-sm font-medium text-primary">{q.id}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{q.customer}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{q.date}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{q.expiry}</td>
                      <td className="px-6 py-4 text-sm font-medium text-foreground text-right">{q.amount}</td>
                      <td className="px-6 py-4"><StatusBadge status={q.status} /></td>
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
