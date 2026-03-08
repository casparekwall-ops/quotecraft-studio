import { useState, useEffect, useRef } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useLanguage, Language } from "@/i18n/LanguageContext";
import { useBrandSettings } from "@/hooks/useBrandSettings";
import { TEMPLATE_LIST, TemplateName } from "@/components/DocumentTemplates";
import { Upload, X } from "lucide-react";

const LANGUAGES: { code: Language; label: string }[] = [
  { code: "en", label: "English" },
  { code: "sv", label: "Svenska" },
  { code: "de", label: "Deutsch" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "zh", label: "中文" },
  { code: "pt", label: "Português" },
];

const Settings = () => {
  const { t, language, setLanguage } = useLanguage();
  const { settings, loading, updateSettings, uploadLogo, removeLogo } = useBrandSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    company_name: "",
    org_number: "",
    company_address: "",
    company_email: "",
    company_phone: "",
    company_website: "",
    primary_color: "#6C47FF",
    secondary_color: "#EC4899",
    footer_text: "",
    default_quote_template: "minimal",
    default_invoice_template: "minimal",
  });

  useEffect(() => {
    if (!loading) {
      setForm({
        full_name: settings.full_name,
        email: settings.company_email,
        phone: settings.company_phone,
        company_name: settings.company_name,
        org_number: settings.org_number,
        company_address: settings.company_address,
        company_email: settings.company_email,
        company_phone: settings.company_phone,
        company_website: settings.company_website,
        primary_color: settings.primary_color,
        secondary_color: settings.secondary_color,
        footer_text: settings.footer_text,
        default_quote_template: settings.default_quote_template,
        default_invoice_template: settings.default_invoice_template,
      });
    }
  }, [loading, settings]);

  const handleSave = async (section: string) => {
    let updates: any = {};
    if (section === "profile") {
      updates = { full_name: form.full_name };
    } else if (section === "company") {
      updates = {
        company_name: form.company_name,
        org_number: form.org_number,
        company_address: form.company_address,
        company_email: form.company_email,
        company_phone: form.company_phone,
        company_website: form.company_website,
      };
    } else if (section === "branding") {
      updates = {
        primary_color: form.primary_color,
        secondary_color: form.secondary_color,
        footer_text: form.footer_text,
      };
    } else if (section === "templates") {
      updates = {
        default_quote_template: form.default_quote_template,
        default_invoice_template: form.default_invoice_template,
      };
    }
    await updateSettings(updates);
    toast.success(t.settings.saved);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadLogo(file);
    if (url) toast.success(t.settings.saved);
    else toast.error("Upload failed");
  };

  const handleRemoveLogo = async () => {
    await removeLogo();
    toast.success(t.settings.saved);
  };

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{t.settings.title}</h1>
        <p className="text-muted-foreground">{t.settings.subtitle}</p>
      </div>

      <Tabs defaultValue="profile" className="max-w-3xl">
        <TabsList className="mb-6 flex-wrap">
          <TabsTrigger value="profile">{t.settings.profile}</TabsTrigger>
          <TabsTrigger value="company">{t.settings.company}</TabsTrigger>
          <TabsTrigger value="branding">{t.settings.branding}</TabsTrigger>
          <TabsTrigger value="language">{t.settings.language}</TabsTrigger>
          <TabsTrigger value="templates">{t.settings.templates}</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="mb-4 font-semibold text-foreground">{t.settings.profileInfo}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{t.settings.fullName}</Label>
                <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
              </div>
            </div>
            <Button className="mt-6" onClick={() => handleSave("profile")}>{t.settings.saveChanges}</Button>
          </div>
        </TabsContent>

        <TabsContent value="company">
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="mb-4 font-semibold text-foreground">{t.settings.companyDetails}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{t.settings.companyNameLabel}</Label>
                <Input value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>{t.settings.orgNumber}</Label>
                <Input value={form.org_number} onChange={(e) => setForm({ ...form, org_number: e.target.value })} placeholder="e.g. 12345678" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>{t.settings.address}</Label>
                <Input value={form.company_address} onChange={(e) => setForm({ ...form, company_address: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>{t.settings.email}</Label>
                <Input type="email" value={form.company_email} onChange={(e) => setForm({ ...form, company_email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>{t.settings.phone}</Label>
                <Input value={form.company_phone} onChange={(e) => setForm({ ...form, company_phone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>{t.settings.website}</Label>
                <Input value={form.company_website} onChange={(e) => setForm({ ...form, company_website: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>{t.settings.logo}</Label>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                {settings.logo_url ? (
                  <div className="flex items-center gap-3">
                    <img src={settings.logo_url} alt="Logo" className="h-16 w-16 rounded-lg border border-border object-contain" />
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>{t.settings.changeLogo}</Button>
                      <Button variant="outline" size="sm" onClick={handleRemoveLogo}><X className="mr-1 h-3 w-3" />{t.settings.removeLogo}</Button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-24 w-full items-center justify-center rounded-lg border-2 border-dashed border-border text-sm text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors cursor-pointer"
                  >
                    <Upload className="mr-2 h-4 w-4" />{t.settings.uploadLogo}
                  </button>
                )}
              </div>
            </div>
            <Button className="mt-6" onClick={() => handleSave("company")}>{t.settings.saveChanges}</Button>
          </div>
        </TabsContent>

        <TabsContent value="branding">
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="mb-4 font-semibold text-foreground">{t.settings.brandingTitle}</h2>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>{t.settings.primaryColor}</Label>
                <div className="flex items-center gap-3">
                  <input type="color" value={form.primary_color} onChange={(e) => setForm({ ...form, primary_color: e.target.value })} className="h-10 w-10 cursor-pointer rounded-lg border border-border" />
                  <Input value={form.primary_color} onChange={(e) => setForm({ ...form, primary_color: e.target.value })} className="max-w-32" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t.settings.secondaryColor}</Label>
                <div className="flex items-center gap-3">
                  <input type="color" value={form.secondary_color} onChange={(e) => setForm({ ...form, secondary_color: e.target.value })} className="h-10 w-10 cursor-pointer rounded-lg border border-border" />
                  <Input value={form.secondary_color} onChange={(e) => setForm({ ...form, secondary_color: e.target.value })} className="max-w-32" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t.settings.footerText}</Label>
                <Textarea value={form.footer_text} onChange={(e) => setForm({ ...form, footer_text: e.target.value })} />
              </div>
            </div>
            <Button className="mt-6" onClick={() => handleSave("branding")}>{t.settings.saveChanges}</Button>
          </div>
        </TabsContent>

        <TabsContent value="language">
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="mb-4 font-semibold text-foreground">{t.settings.languageTitle}</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>{t.settings.appLanguage}</Label>
                <p className="text-sm text-muted-foreground">{t.settings.appLanguageDesc}</p>
                <Select value={language} onValueChange={(v) => setLanguage(v as Language)}>
                  <SelectTrigger className="max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map(l => (
                      <SelectItem key={l.code} value={l.code}>{l.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="mb-4 font-semibold text-foreground">{t.settings.templatesTitle}</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{t.settings.defaultQuoteTemplate}</Label>
                <Select value={form.default_quote_template} onValueChange={(v) => setForm({ ...form, default_quote_template: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TEMPLATE_LIST.map(tmpl => (
                      <SelectItem key={tmpl} value={tmpl}>{t.templates[tmpl]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t.settings.defaultInvoiceTemplate}</Label>
                <Select value={form.default_invoice_template} onValueChange={(v) => setForm({ ...form, default_invoice_template: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TEMPLATE_LIST.map(tmpl => (
                      <SelectItem key={tmpl} value={tmpl}>{t.templates[tmpl]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button className="mt-6" onClick={() => handleSave("templates")}>{t.settings.saveChanges}</Button>
          </div>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default Settings;
