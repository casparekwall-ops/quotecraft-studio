import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const NewCustomer = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "", company: "", notes: "",
  });

  const update = (field: string, value: string) => setForm({ ...form, [field]: value });

  const handleSave = () => {
    toast.success("Customer added");
    navigate("/customers");
  };

  return (
    <AppLayout>
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/customers")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Add Customer</h1>
          <p className="text-muted-foreground">Add a new customer to your contacts.</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label>Full Name *</Label>
              <Input placeholder="John Smith" value={form.name} onChange={(e) => update("name", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input type="email" placeholder="john@example.com" value={form.email} onChange={(e) => update("email", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input placeholder="+1 555-0100" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Address</Label>
              <Input placeholder="123 Main St, City, State" value={form.address} onChange={(e) => update("address", e.target.value)} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Company Name (optional)</Label>
              <Input placeholder="Company name" value={form.company} onChange={(e) => update("company", e.target.value)} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Notes</Label>
              <Textarea placeholder="Any additional notes..." value={form.notes} onChange={(e) => update("notes", e.target.value)} />
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <Button onClick={handleSave}>Save Customer</Button>
            <Button variant="outline" onClick={() => navigate("/customers")}>Cancel</Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default NewCustomer;
