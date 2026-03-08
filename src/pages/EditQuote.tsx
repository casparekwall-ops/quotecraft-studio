import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, Plus, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageContext";
import CurrencySelect from "@/components/CurrencySelect";
import { formatCurrency, CurrencyCode, getCurrencySymbol } from "@/lib/currency";

interface LineItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

const EditQuote = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [customerId, setCustomerId] = useState("");
  const [customers, setCustomers] = useState<{ id: string; name: string }[]>([]);
  const [quoteNumber, setQuoteNumber] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState("");
  const [taxEnabled, setTaxEnabled] = useState(true);
  const [taxRate, setTaxRate] = useState(10);
  const [discount, setDiscount] = useState(0);
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<LineItem[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!id) return;

      const [{ data: quote }, { data: lineItems }, { data: custList }] = await Promise.all([
        supabase
          .from("quotes")
          .select("id, quote_number, status, issue_date, expiry_date, subtotal, tax, discount, total, notes, terms, customer_id, currency")
          .eq("id", id)
          .maybeSingle(),
        supabase.from("quote_items").select("*").eq("quote_id", id).order("id"),
        supabase.from("customers").select("id, name").order("name"),
      ]);

      setCustomers(custList || []);

      if (!quote) {
        toast.error(t.quotes.quoteNotFound);
        navigate("/quotes");
        return;
      }

      setQuoteNumber(quote.quote_number);
      setCustomerId(quote.customer_id || "");
      setIssueDate(quote.issue_date);
      setExpiryDate(quote.expiry_date || "");
      setNotes(quote.notes || "");
      setTerms(quote.terms || "");
      setDiscount(Number(quote.discount) || 0);
      setCurrency((quote.currency || "USD") as CurrencyCode);

      const sub = Number(quote.subtotal) || 0;
      const tax = Number(quote.tax) || 0;
      if (sub > 0 && tax > 0) {
        setTaxEnabled(true);
        setTaxRate(Math.round((tax / sub) * 100));
      } else {
        setTaxEnabled(tax > 0);
        setTaxRate(tax > 0 && sub > 0 ? Math.round((tax / sub) * 100) : 10);
      }

      if (lineItems && lineItems.length > 0) {
        setItems(
          lineItems.map((li: any) => ({
            id: li.id, name: li.item_name, description: li.description || "",
            quantity: Number(li.quantity), unitPrice: Number(li.unit_price),
          }))
        );
      } else {
        setItems([{ id: "1", name: "", description: "", quantity: 1, unitPrice: 0 }]);
      }

      setLoading(false);
    };
    load();
  }, [id, navigate]);

  const addItem = () =>
    setItems([...items, { id: Date.now().toString(), name: "", description: "", quantity: 1, unitPrice: 0 }]);
  const removeItem = (itemId: string) => {
    if (items.length > 1) setItems(items.filter((i) => i.id !== itemId));
  };
  const updateItem = (itemId: string, field: keyof LineItem, value: string | number) =>
    setItems(items.map((i) => (i.id === itemId ? { ...i, [field]: value } : i)));

  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  const taxAmount = taxEnabled ? subtotal * (taxRate / 100) : 0;
  const total = subtotal + taxAmount - discount;
  const sym = getCurrencySymbol(currency);

  const handleSave = async () => {
    if (!id) return;
    if (items.every((i) => !i.name.trim())) {
      toast.error(t.quotes.addAtLeastOneItem);
      return;
    }
    setSaving(true);

    const { error } = await supabase
      .from("quotes")
      .update({
        customer_id: customerId || null,
        issue_date: issueDate, expiry_date: expiryDate || null,
        subtotal, tax: taxAmount, discount, total,
        notes: notes || null, terms: terms || null, currency,
      })
      .eq("id", id);

    if (error) { toast.error(error.message); setSaving(false); return; }

    await supabase.from("quote_items").delete().eq("quote_id", id);

    const quoteItems = items.filter((i) => i.name.trim()).map((i) => ({
      quote_id: id, item_name: i.name, description: i.description || null,
      quantity: i.quantity, unit_price: i.unitPrice, line_total: i.quantity * i.unitPrice,
    }));

    if (quoteItems.length > 0) {
      const { error: itemsError } = await supabase.from("quote_items").insert(quoteItems);
      if (itemsError) { toast.error(itemsError.message); setSaving(false); return; }
    }

    setSaving(false);
    toast.success(t.quotes.quoteUpdated);
    navigate(`/quotes/${id}`);
  };

  if (loading) {
    return <AppLayout><div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64 rounded-xl" /></div></AppLayout>;
  }

  return (
    <AppLayout>
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(`/quotes/${id}`)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t.quotes.editQuote} {quoteNumber}</h1>
          <p className="text-muted-foreground">{t.quotes.updateDetails}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="mb-4 font-semibold text-foreground">{t.quotes.details}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{t.quotes.customer}</Label>
                <Select value={customerId} onValueChange={setCustomerId}>
                  <SelectTrigger><SelectValue placeholder={t.common.selectCustomer} /></SelectTrigger>
                  <SelectContent>
                    {customers.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t.quotes.quoteDate}</Label>
                <Input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>{t.quotes.expiryDate}</Label>
                <Input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>{t.quotes.currency}</Label>
                <CurrencySelect value={currency} onValueChange={setCurrency} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-foreground">{t.quotes.lineItems}</h2>
              <Button variant="outline" size="sm" onClick={addItem}><Plus className="mr-1 h-3.5 w-3.5" />{t.quotes.addItem}</Button>
            </div>
            <div className="space-y-4">
              {items.map((item, idx) => (
                <div key={item.id} className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">{t.common.item} {idx + 1}</span>
                    {items.length > 1 && (
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeItem(item.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input placeholder={t.quotes.itemName} value={item.name} onChange={(e) => updateItem(item.id, "name", e.target.value)} />
                    <Input placeholder={t.quotes.description} value={item.description} onChange={(e) => updateItem(item.id, "description", e.target.value)} />
                    <Input type="number" placeholder={t.quotes.qty} min={1} value={item.quantity} onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))} />
                    <Input type="number" placeholder={t.quotes.unitPrice} min={0} step={0.01} value={item.unitPrice || ""} onChange={(e) => updateItem(item.id, "unitPrice", Number(e.target.value))} />
                  </div>
                  <div className="mt-2 text-right text-sm font-medium text-foreground">
                    {t.quotes.lineTotal}: {formatCurrency(item.quantity * item.unitPrice, currency)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="mb-4 font-semibold text-foreground">{t.quotes.notesAndTerms}</h2>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>{t.quotes.notes}</Label>
                <Textarea placeholder={t.quotes.additionalNotes} value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>{t.quotes.termsAndConditions}</Label>
                <Textarea placeholder={t.quotes.terms} value={terms} onChange={(e) => setTerms(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="sticky top-6 rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="mb-4 font-semibold text-foreground">{t.quotes.summary}</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>{t.quotes.tax}</Label>
                <Switch checked={taxEnabled} onCheckedChange={setTaxEnabled} />
              </div>
              {taxEnabled && (
                <div className="space-y-2">
                  <Label>{t.quotes.taxRate}</Label>
                  <Input type="number" min={0} max={100} value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} />
                </div>
              )}
              <div className="space-y-2">
                <Label>{t.quotes.discount} ({sym})</Label>
                <Input type="number" min={0} value={discount || ""} onChange={(e) => setDiscount(Number(e.target.value))} />
              </div>
              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t.quotes.subtotal}</span>
                  <span className="text-foreground">{formatCurrency(subtotal, currency)}</span>
                </div>
                {taxEnabled && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t.quotes.tax} ({taxRate}%)</span>
                    <span className="text-foreground">{formatCurrency(taxAmount, currency)}</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t.quotes.discount}</span>
                    <span className="text-destructive">-{formatCurrency(discount, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-border pt-2 text-lg font-bold">
                  <span className="text-foreground">{t.quotes.total}</span>
                  <span className="text-foreground">{formatCurrency(total, currency)}</span>
                </div>
              </div>
              <div className="pt-2">
                <Button className="w-full" onClick={handleSave} disabled={saving}>
                  {saving ? t.quotes.saving : t.settings.saveChanges}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default EditQuote;
