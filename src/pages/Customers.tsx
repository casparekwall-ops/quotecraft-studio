import { useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Plus, Search, Mail, Phone } from "lucide-react";

const mockCustomers = [
  { id: "1", name: "Sarah Johnson", email: "sarah@johnson.com", phone: "+1 555-0101", company: "Johnson Builds", quotes: 3, invoices: 2 },
  { id: "2", name: "Mike Chen", email: "mike@chen.com", phone: "+1 555-0102", company: "", quotes: 1, invoices: 0 },
  { id: "3", name: "Emily Davis", email: "emily@davishome.com", phone: "+1 555-0103", company: "Davis Home Reno", quotes: 2, invoices: 1 },
  { id: "4", name: "Tom Wilson", email: "tom@wilson.com", phone: "+1 555-0104", company: "", quotes: 1, invoices: 1 },
  { id: "5", name: "Lisa Park", email: "lisa@parkdesign.com", phone: "+1 555-0105", company: "Park Design Co", quotes: 4, invoices: 3 },
];

const Customers = () => {
  const [search, setSearch] = useState("");
  const filtered = mockCustomers.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()) || c.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Customers</h1>
          <p className="text-muted-foreground">Manage your customer contacts.</p>
        </div>
        <Button size="sm" asChild>
          <Link to="/customers/new">
            <Plus className="mr-1 h-4 w-4" />
            Add Customer
          </Link>
        </Button>
      </div>

      {mockCustomers.length === 0 ? (
        <EmptyState
          icon={<Users className="h-8 w-8" />}
          title="No customers yet"
          description="Add your first customer to start creating quotes."
          action={
            <Button asChild>
              <Link to="/customers/new">
                <Plus className="mr-1 h-4 w-4" />
                Add Customer
              </Link>
            </Button>
          }
        />
      ) : (
        <>
          <div className="mb-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search customers..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => (
              <div key={c.id} className="rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-soft cursor-pointer">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {c.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{c.name}</div>
                    {c.company && <div className="text-xs text-muted-foreground">{c.company}</div>}
                  </div>
                </div>
                <div className="space-y-1.5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" />{c.email}</div>
                  <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" />{c.phone}</div>
                </div>
                <div className="mt-4 flex gap-4 border-t border-border pt-3 text-xs text-muted-foreground">
                  <span>{c.quotes} quotes</span>
                  <span>{c.invoices} invoices</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </AppLayout>
  );
};

export default Customers;
