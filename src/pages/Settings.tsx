import { useState, useEffect, useRef, useMemo } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useLanguage, Language } from "@/i18n/LanguageContext";
import { useBrandSettings } from "@/hooks/useBrandSettings";
import { TEMPLATE_LIST, TemplateName, generateTemplateHTML } from "@/components/DocumentTemplates";
import { Upload, X, Check, Palette, FileText, Building2, User, Globe, Coins } from "lucide-react";
import CurrencySelect from "@/components/CurrencySelect";
import { CurrencyCode } from "@/lib/currency";

const LANGUAGES: { code: Language; flag: string; label: string }[] = [
  { code: "en", flag: "🇬🇧", label: "English" },
  { code: "sv", flag: "🇸🇪", label: "Svenska" },
  { code: "de", flag: "🇩🇪", label: "Deutsch" },
  { code: "es", flag: "🇪🇸", label: "Español" },
  { code: "fr", flag: "🇫🇷", label: "Français" },
  { code: "zh", flag: "🇨🇳", label: "中文" },
  { code: "pt", flag: "🇧🇷", label: "Português" },
];

const COLOR_PRESETS = [
  { primary: "#6C47FF", secondary: "#EC4899", label: "Violet & Pink" },
  { primary: "#0EA5E9", secondary: "#6366F1", label: "Sky & Indigo" },
  { primary: "#10B981", secondary: "#06B6D4", label: "Emerald & Cyan" },
  { primary: "#F59E0B", secondary: "#EF4444", label: "Amber & Red" },
  { primary: "#1E293B", secondary: "#64748B", label: "Slate" },
  { primary: "#7C3AED", secondary: "#2563EB", label: "Purple & Blue" },
];

const Settings = () => {
  const { t, language, setLanguage } = useLanguage();

  const TEMPLATE_META: Record<TemplateName, { icon: string }> = {
    minimal: { icon: "○" },
    classic: { icon: "◆" },
    bold: { icon: "▮" },
    elegant: { icon: "◇" },
    compact: { icon: "▪" },
  };
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
    default_quote_template: "minimal" as TemplateName,
    default_invoice_template: "minimal" as TemplateName,
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
        default_quote_template: (settings.default_quote_template || "minimal") as TemplateName,
        default_invoice_template: (settings.default_invoice_template || "minimal") as TemplateName,
      });
    }
  }, [loading, settings]);

  const handleSave = async (section: string) => {
    let updates: any = {};
    if (section === "profile") {
      updates = { full_name: form.full_name };
    } else if (section === "company") {
      updates = {
        company_name: form.company_name, org_number: form.org_number,
        company_address: form.company_address, company_email: form.company_email,
        company_phone: form.company_phone, company_website: form.company_website,
      };
    } else if (section === "branding") {
      updates = {
        primary_color: form.primary_color, secondary_color: form.secondary_color,
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
    else toast.error(t.settings.uploadFailed);
  };

  const handleRemoveLogo = async () => {
    await removeLogo();
    toast.success(t.settings.saved);
  };

  // Live branding preview swatch
  const brandPreviewHTML = useMemo(() => {
    const sampleData = {
      type: "invoice" as const, number: "INV-001", status: "sent",
      issueDate: new Date().toISOString().split("T")[0],
      customerName: "Acme Corp", items: [
        { name: "Design Work", description: "UI/UX", quantity: 1, unitPrice: 500, lineTotal: 500 },
      ],
      subtotal: 500, tax: 50, discount: 0, total: 550,
    };
    return generateTemplateHTML(form.default_invoice_template, sampleData, {
      ...settings,
      primary_color: form.primary_color,
      secondary_color: form.secondary_color,
      footer_text: form.footer_text,
    });
  }, [form.primary_color, form.secondary_color, form.footer_text, form.default_invoice_template, settings]);

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{t.settings.title}</h1>
        <p className="text-muted-foreground">{t.settings.subtitle}</p>
      </div>

      <Tabs defaultValue="profile" className="max-w-4xl">
        <TabsList className="mb-6 h-auto flex-wrap gap-1 bg-transparent p-0">
          {[
            { value: "profile", icon: User, label: t.settings.profile },
            { value: "company", icon: Building2, label: t.settings.company },
            { value: "branding", icon: Palette, label: t.settings.branding },
            { value: "language", icon: Globe, label: t.settings.language },
            { value: "templates", icon: FileText, label: t.settings.templates },
          ].map(tab => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="gap-1.5 rounded-lg border border-transparent px-3 py-2 text-sm data-[state=active]:border-border data-[state=active]:bg-card data-[state=active]:shadow-sm"
            >
              <tab.icon className="h-3.5 w-3.5" />{tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* PROFILE */}
        <TabsContent value="profile">
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="mb-1 font-semibold text-foreground">{t.settings.profileInfo}</h2>
            <p className="mb-5 text-sm text-muted-foreground">{t.settings.profileDesc}</p>
            <div className="grid gap-4 sm:grid-cols-2 max-w-lg">
              <div className="space-y-2 sm:col-span-2">
                <Label>{t.settings.fullName}</Label>
                <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
              </div>
            </div>
            <Button className="mt-6" size="sm" onClick={() => handleSave("profile")}>{t.settings.saveChanges}</Button>
          </div>
        </TabsContent>

        {/* COMPANY */}
        <TabsContent value="company">
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="mb-1 font-semibold text-foreground">{t.settings.companyDetails}</h2>
            <p className="mb-5 text-sm text-muted-foreground">{t.settings.companyDesc}</p>
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

              {/* Logo upload */}
              <div className="space-y-2">
                <Label>{t.settings.logo}</Label>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                {settings.logo_url ? (
                  <div className="flex items-center gap-3">
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-border bg-muted/30 p-1.5">
                      <img src={settings.logo_url} alt="Logo" className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => fileInputRef.current?.click()}>{t.settings.changeLogo}</Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-destructive" onClick={handleRemoveLogo}>
                        <X className="mr-1 h-3 w-3" />{t.settings.removeLogo}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-20 w-full items-center justify-center rounded-lg border-2 border-dashed border-border text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors cursor-pointer"
                  >
                    <Upload className="mr-1.5 h-3.5 w-3.5" />{t.settings.uploadLogo}
                  </button>
                )}
              </div>
            </div>
            <Button className="mt-6" size="sm" onClick={() => handleSave("company")}>{t.settings.saveChanges}</Button>
          </div>
        </TabsContent>

        {/* BRANDING */}
        <TabsContent value="branding">
          <div className="grid gap-6 lg:grid-cols-5">
            <div className="rounded-xl border border-border bg-card p-6 shadow-card lg:col-span-2">
              <h2 className="mb-1 font-semibold text-foreground">{t.settings.brandingTitle}</h2>
              <p className="mb-5 text-sm text-muted-foreground">{t.settings.brandingDesc}</p>

              {/* Color presets */}
              <Label className="mb-2 block">{t.settings.primaryColor}</Label>
              <div className="flex flex-wrap gap-2 mb-4">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => setForm({ ...form, primary_color: preset.primary, secondary_color: preset.secondary })}
                    className={`group relative flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all ${
                      form.primary_color === preset.primary && form.secondary_color === preset.secondary
                        ? "border-foreground scale-110"
                        : "border-transparent hover:scale-105"
                    }`}
                    title={preset.label}
                  >
                    <span
                      className="block h-6 w-6 rounded-full"
                      style={{ background: `linear-gradient(135deg, ${preset.primary}, ${preset.secondary})` }}
                    />
                    {form.primary_color === preset.primary && form.secondary_color === preset.secondary && (
                      <Check className="absolute h-3 w-3 text-white drop-shadow-sm" />
                    )}
                  </button>
                ))}
              </div>

              {/* Custom pickers */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">{t.settings.primaryColor}</Label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={form.primary_color} onChange={(e) => setForm({ ...form, primary_color: e.target.value })} className="h-8 w-8 cursor-pointer rounded border border-border p-0.5" />
                    <Input value={form.primary_color} onChange={(e) => setForm({ ...form, primary_color: e.target.value })} className="h-8 text-xs font-mono" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">{t.settings.secondaryColor}</Label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={form.secondary_color} onChange={(e) => setForm({ ...form, secondary_color: e.target.value })} className="h-8 w-8 cursor-pointer rounded border border-border p-0.5" />
                    <Input value={form.secondary_color} onChange={(e) => setForm({ ...form, secondary_color: e.target.value })} className="h-8 text-xs font-mono" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">{t.settings.footerText}</Label>
                <Textarea value={form.footer_text} onChange={(e) => setForm({ ...form, footer_text: e.target.value })} rows={2} className="text-sm" />
              </div>

              <Button className="mt-5" size="sm" onClick={() => handleSave("branding")}>{t.settings.saveChanges}</Button>
            </div>

            {/* Live branding preview */}
            <div className="rounded-xl border border-border bg-card p-4 shadow-card lg:col-span-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t.settings.livePreview}</span>
                <div className="h-2.5 w-2.5 rounded-full bg-success animate-pulse" />
              </div>
              <div className="overflow-auto rounded-lg border border-border bg-white max-h-[480px]">
                <div
                  dangerouslySetInnerHTML={{ __html: brandPreviewHTML }}
                  className="origin-top-left scale-[0.65] w-[154%]"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* LANGUAGE */}
        <TabsContent value="language">
          <div className="rounded-xl border border-border bg-card p-6 shadow-card max-w-lg">
            <h2 className="mb-1 font-semibold text-foreground">{t.settings.languageTitle}</h2>
            <p className="mb-5 text-sm text-muted-foreground">{t.settings.appLanguageDesc}</p>
            <div className="grid grid-cols-1 gap-1.5">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-all ${
                    lang.code === language
                      ? "bg-primary/5 border border-primary/20 font-medium text-foreground"
                      : "border border-transparent text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span>{lang.label}</span>
                  {lang.code === language && <Check className="ml-auto h-4 w-4 text-primary" />}
                </button>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* TEMPLATES */}
        <TabsContent value="templates">
          <div className="space-y-6">
            {(["quote", "invoice"] as const).map(docType => {
              const currentTemplate = docType === "quote" ? form.default_quote_template : form.default_invoice_template;
              const setTmpl = (v: TemplateName) => {
                if (docType === "quote") setForm({ ...form, default_quote_template: v });
                else setForm({ ...form, default_invoice_template: v });
              };

              return (
                <div key={docType} className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <h2 className="mb-1 font-semibold text-foreground capitalize">
                    {docType === "quote" ? t.settings.defaultQuoteTemplate : t.settings.defaultInvoiceTemplate}
                  </h2>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {t.settings.templateUsedFor} {docType === "quote" ? t.quotes.title.toLowerCase() : t.invoices.title.toLowerCase()}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {TEMPLATE_LIST.map(tmpl => {
                      const meta = TEMPLATE_META[tmpl];
                      const isSelected = tmpl === currentTemplate;
                      return (
                        <button
                          key={tmpl}
                          onClick={() => setTmpl(tmpl)}
                          className={`group relative flex flex-col items-center rounded-xl border-2 p-4 transition-all ${
                            isSelected
                              ? "border-primary bg-primary/5 shadow-sm"
                              : "border-border hover:border-primary/30 hover:bg-accent/50"
                          }`}
                        >
                          <span className="text-2xl mb-2 text-muted-foreground group-hover:text-foreground transition-colors">
                            {meta.icon}
                          </span>
                          <span className={`text-xs font-medium ${isSelected ? "text-primary" : "text-foreground"}`}>
                            {t.templates[tmpl]}
                          </span>
                          <span className="text-[10px] text-muted-foreground mt-0.5">{t.templateDesc[tmpl]}</span>
                          {isSelected && (
                            <div className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                              <Check className="h-3 w-3" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            <Button size="sm" onClick={() => handleSave("templates")}>{t.settings.saveChanges}</Button>
          </div>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default Settings;
