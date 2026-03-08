import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, ArrowLeft, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageContext";
import { useBrandSettings } from "@/hooks/useBrandSettings";
import DocumentPreview from "@/components/DocumentPreview";
import { TEMPLATE_LIST, TemplateName } from "@/components/DocumentTemplates";
import CurrencySelect from "@/components/CurrencySelect";
import { formatCurrency, CurrencyCode } from "@/lib/currency";

interface LineItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

const NewQuote = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { settings } = useBrandSettings();
  const [customerId, setCustomerId] = useState("");
  const [customers, setCustomers] = useState<{ id: string; name: string; email?: string | null }[]>([]);
  const [projectDesc, setProjectDesc] = useState("");
  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState("");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0]);
  const [expiryDate, setExpiryDate] = useState("");
  const [taxEnabled, setTaxEnabled] = useState(true);
  const [taxRate, setTaxRate] = useState(10);
  const [discount, setDiscount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [template, setTemplate] = useState<TemplateName>("minimal");
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [items, setItems] = useState<LineItem[]>([
    { id: "1", name: "", description: "", quantity: 1, unitPrice: 0 },
  ]);

  useEffect(() => {
    supabase.from("customers").select("id, name, email").order("name").then(({ data }) => setCustomers(data || []));
  }, []);

  useEffect(() => {
    if (settings.default_quote_template) setTemplate(settings.default_quote_template as TemplateName);
    if (settings.default_currency) setCurrency(settings.default_currency as CurrencyCode);
  }, [settings.default_quote_template, settings.default_currency]);

  const addItem = () => setItems([...items, { id: Date.now().toString(), name: "", description: "", quantity: 1, unitPrice: 0 }]);
  const removeItem = (id: string) => { if (items.length > 1) setItems(items.filter((i) => i.id !== id)); };
  const updateItem = (id: string, field: keyof LineItem, value: string | number) => setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));

  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  const taxAmount = taxEnabled ? subtotal * (taxRate / 100) : 0;
  const total = subtotal + taxAmount - discount;

  const selectedCustomer = customers.find(c => c.id === customerId);

  const handleSave = async (status: "draft" | "sent" = "draft") => {
    if (!user) return;
    if (items.every((i) => !i.name.trim())) { toast.error(t.quotes.addAtLeastOneItem); return; }
    setSaving(true);

    const { data: numData, error: numError } = await supabase.rpc("generate_document_number", {
      p_user_id: user.id,
      p_doc_type: "quote",
    });
    if (numError || !numData) { toast.error(numError?.message || "Failed to generate number"); setSaving(false); return; }
    const quoteNumber = numData as string;

    const { data: quote, error } = await supabase.from("quotes").insert({
      user_id: user.id, customer_id: customerId || null, quote_number: quoteNumber,
      status, issue_date: issueDate, expiry_date: expiryDate || null,
      subtotal, tax: taxAmount, discount, total, currency,
      notes: [projectDesc, notes].filter(Boolean).join("\n\n") || null, terms: terms || null,
    }).select().single();

    if (error || !quote) { toast.error(error?.message || "Failed to save"); setSaving(false); return; }

    const quoteItems = items.filter((i) => i.name.trim()).map((i) => ({
      quote_id: quote.id, item_name: i.name, description: i.description || null,
      quantity: i.quantity, unit_price: i.unitPrice, line_total: i.quantity * i.unitPrice,
    }));

    if (quoteItems.length > 0) {
      const { error: itemsError } = await supabase.from("quote_items").insert(quoteItems);
      if (itemsError) { toast.error(itemsError.message); setSaving(false); return; }
    }

    setSaving(false);
    toast.success(status === "sent" ? t.quotes.sendQuote : t.quotes.saveDraft);
    navigate("/quotes");
  };

  const previewData = {
    type: "quote" as const,
    number: "QC-Q-NEW",
    status: "draft",
    issueDate,
    expiryDate: expiryDate || undefined,
    customerName: selectedCustomer?.name,
    customerEmail: selectedCustomer?.email || undefined,
    currency,
    items: items.filter(i => i.name.trim()).map(i => ({
      name: i.name, description: i.description, quantity: i.quantity,
      unitPrice: i.unitPrice, lineTotal: i.quantity * i.unitPrice,
    })),
    subtotal, tax: taxAmount, discount, total,
    notes: [projectDesc, notes].filter(Boolean).join("\n\n") || undefined,
    terms: terms || undefined,
  };

  const fc = (amount: number) => formatCurrency(amount, currency);

  return (
    <AppLayout>
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/quotes")}><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t.quotes.newQuote}</h1>
          <p className="text-muted-foreground">{t.quotes.createNewQuote}</p>
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
                <Label>{t.quotes.currency}</Label>
                <CurrencySelect value={currency} onValueChange={setCurrency} />
              </div>
              <div className="space-y-2">
                <Label>{t.quotes.quoteDate}</Label>
                <Input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>{t.quotes.expiryDate}</Label>
                <Input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>{t.quotes.projectDescription}</Label>
                <Textarea placeholder={t.quotes.describeProject} value={projectDesc} onChange={(e) => setProjectDesc(e.target.value)} />
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
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeItem(item.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    )}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input placeholder={t.quotes.itemName} value={item.name} onChange={(e) => updateItem(item.id, "name", e.target.value)} />
                    <Input placeholder={t.quotes.description} value={item.description} onChange={(e) => updateItem(item.id, "description", e.target.value)} />
                    <Input type="number" placeholder={t.quotes.qty} min={1} value={item.quantity} onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))} />
                    <Input type="number" placeholder={t.quotes.unitPrice} min={0} step={0.01} value={item.unitPrice || ""} onChange={(e) => updateItem(item.id, "unitPrice", Number(e.target.value))} />
                  </div>
                  <div className="mt-2 text-right text-sm font-medium text-foreground">{t.quotes.lineTotal}: {fc(item.quantity * item.unitPrice)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="mb-4 font-semibold text-foreground">{t.quotes.notesAndTerms}</h2>
            <div className="grid gap-4">
              <div className="space-y-2"><Label>{t.quotes.notes}</Label><Textarea placeholder={t.quotes.additionalNotes} value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
              <div className="space-y-2"><Label>{t.quotes.termsAndConditions}</Label><Textarea placeholder={t.quotes.terms} value={terms} onChange={(e) => setTerms(e.target.value)} /></div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="sticky top-6 rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="mb-4 font-semibold text-foreground">{t.quotes.summary}</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t.quotes.template}</Label>
                <Select value={template} onValueChange={(v) => setTemplate(v as TemplateName)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TEMPLATE_LIST.map(tmpl => (
                      <SelectItem key={tmpl} value={tmpl}>{t.templates[tmpl]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between"><Label>{t.quotes.tax}</Label><Switch checked={taxEnabled} onCheckedChange={setTaxEnabled} /></div>
              {taxEnabled && (
                <div className="space-y-2"><Label>{t.quotes.taxRate}</Label><Input type="number" min={0} max={100} value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} /></div>
              )}
              <div className="space-y-2"><Label>{t.quotes.discount}</Label><Input type="number" min={0} value={discount || ""} onChange={(e) => setDiscount(Number(e.target.value))} /></div>
              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t.quotes.subtotal}</span><span className="text-foreground">{fc(subtotal)}</span></div>
                {taxEnabled && <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t.quotes.tax} ({taxRate}%)</span><span className="text-foreground">{fc(taxAmount)}</span></div>}
                {discount > 0 && <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t.quotes.discount}</span><span className="text-destructive">-{fc(discount)}</span></div>}
                <div className="flex justify-between border-t border-border pt-2 text-lg font-bold"><span className="text-foreground">{t.quotes.total}</span><span className="text-foreground">{fc(total)}</span></div>
              </div>
              <div className="space-y-2 pt-2">
                <DocumentPreview
                  data={previewData}
                  defaultTemplate={template}
                  trigger={<Button className="w-full" variant="outline"><Eye className="mr-1 h-3.5 w-3.5" />{t.quotes.preview}</Button>}
                />
                <Button className="w-full" variant="outline" onClick={() => handleSave("draft")} disabled={saving}>{saving ? t.quotes.saving : t.quotes.saveDraft}</Button>
                <Button className="w-full" onClick={() => handleSave("sent")} disabled={saving}>{saving ? t.quotes.saving : t.quotes.sendQuote}</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default NewQuote;
