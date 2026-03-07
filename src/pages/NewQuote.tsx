import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface LineItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

const NewQuote = () => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState("Payment due within 14 days of acceptance.");
  const [taxEnabled, setTaxEnabled] = useState(true);
  const [taxRate, setTaxRate] = useState(10);
  const [discount, setDiscount] = useState(0);
  const [items, setItems] = useState<LineItem[]>([
    { id: "1", name: "", description: "", quantity: 1, unitPrice: 0 },
  ]);

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), name: "", description: "", quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) setItems(items.filter((i) => i.id !== id));
  };

  const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  const taxAmount = taxEnabled ? subtotal * (taxRate / 100) : 0;
  const discountAmount = discount;
  const total = subtotal + taxAmount - discountAmount;

  const handleSave = () => {
    toast.success("Quote saved as draft");
    navigate("/quotes");
  };

  return (
    <AppLayout>
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/quotes")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">New Quote</h1>
          <p className="text-muted-foreground">Create a new quote for your customer.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Customer & details */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="mb-4 font-semibold text-foreground">Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Customer</Label>
                <Input placeholder="Select or type customer name" value={customer} onChange={(e) => setCustomer(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Quote Date</Label>
                <Input type="date" defaultValue={new Date().toISOString().split("T")[0]} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Project Description</Label>
                <Textarea placeholder="Describe the project..." value={projectDesc} onChange={(e) => setProjectDesc(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Line items */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-foreground">Line Items</h2>
              <Button variant="outline" size="sm" onClick={addItem}>
                <Plus className="mr-1 h-3.5 w-3.5" />
                Add Item
              </Button>
            </div>
            <div className="space-y-4">
              {items.map((item, idx) => (
                <div key={item.id} className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Item {idx + 1}</span>
                    {items.length > 1 && (
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeItem(item.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input placeholder="Item name" value={item.name} onChange={(e) => updateItem(item.id, "name", e.target.value)} />
                    <Input placeholder="Description" value={item.description} onChange={(e) => updateItem(item.id, "description", e.target.value)} />
                    <Input type="number" placeholder="Qty" min={1} value={item.quantity} onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))} />
                    <Input type="number" placeholder="Unit price" min={0} step={0.01} value={item.unitPrice || ""} onChange={(e) => updateItem(item.id, "unitPrice", Number(e.target.value))} />
                  </div>
                  <div className="mt-2 text-right text-sm font-medium text-foreground">
                    Line total: ${(item.quantity * item.unitPrice).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes & terms */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="mb-4 font-semibold text-foreground">Notes & Terms</h2>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea placeholder="Additional notes..." value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Terms & Conditions</Label>
                <Textarea placeholder="Terms..." value={terms} onChange={(e) => setTerms(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* Summary sidebar */}
        <div className="space-y-6">
          <div className="sticky top-6 rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="mb-4 font-semibold text-foreground">Summary</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Tax</Label>
                <Switch checked={taxEnabled} onCheckedChange={setTaxEnabled} />
              </div>
              {taxEnabled && (
                <div className="space-y-2">
                  <Label>Tax Rate (%)</Label>
                  <Input type="number" min={0} max={100} value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} />
                </div>
              )}
              <div className="space-y-2">
                <Label>Discount ($)</Label>
                <Input type="number" min={0} value={discount || ""} onChange={(e) => setDiscount(Number(e.target.value))} />
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="text-foreground">${subtotal.toFixed(2)}</span></div>
                {taxEnabled && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Tax ({taxRate}%)</span><span className="text-foreground">${taxAmount.toFixed(2)}</span></div>}
                {discountAmount > 0 && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Discount</span><span className="text-destructive">-${discountAmount.toFixed(2)}</span></div>}
                <div className="flex justify-between border-t border-border pt-2 text-lg font-bold"><span className="text-foreground">Total</span><span className="text-foreground">${total.toFixed(2)}</span></div>
              </div>

              <div className="space-y-2 pt-2">
                <Button className="w-full" onClick={handleSave}>Save Draft</Button>
                <Button variant="outline" className="w-full">Preview</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default NewQuote;
