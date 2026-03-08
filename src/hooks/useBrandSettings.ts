import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface BrandSettings {
  company_name: string;
  company_address: string;
  company_phone: string;
  company_email: string;
  company_website: string;
  org_number: string;
  logo_url: string;
  primary_color: string;
  secondary_color: string;
  footer_text: string;
  default_quote_template: string;
  default_invoice_template: string;
  default_currency: string;
  full_name: string;
}

const defaults: BrandSettings = {
  company_name: "",
  company_address: "",
  company_phone: "",
  company_email: "",
  company_website: "",
  org_number: "",
  logo_url: "",
  primary_color: "#6C47FF",
  secondary_color: "#EC4899",
  footer_text: "Thank you for your business!",
  default_quote_template: "minimal",
  default_invoice_template: "minimal",
  full_name: "",
};

export function useBrandSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<BrandSettings>(defaults);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (data) {
      setSettings({
        company_name: (data as any).company_name || "",
        company_address: (data as any).company_address || "",
        company_phone: (data as any).company_phone || "",
        company_email: (data as any).company_email || "",
        company_website: (data as any).company_website || "",
        org_number: (data as any).org_number || "",
        logo_url: (data as any).logo_url || "",
        primary_color: (data as any).primary_color || "#6C47FF",
        secondary_color: (data as any).secondary_color || "#EC4899",
        footer_text: (data as any).footer_text || "Thank you for your business!",
        default_quote_template: (data as any).default_quote_template || "minimal",
        default_invoice_template: (data as any).default_invoice_template || "minimal",
        full_name: data.full_name || "",
      });
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const updateSettings = useCallback(async (updates: Partial<BrandSettings>) => {
    if (!user) return;
    const dbUpdates: any = {};
    for (const [key, value] of Object.entries(updates)) {
      dbUpdates[key] = value;
    }
    await supabase.from("profiles").update(dbUpdates).eq("id", user.id);
    setSettings(prev => ({ ...prev, ...updates }));
  }, [user]);

  const uploadLogo = useCallback(async (file: File) => {
    if (!user) return null;
    const ext = file.name.split(".").pop();
    const path = `${user.id}/logo.${ext}`;
    
    const { error } = await supabase.storage
      .from("logos")
      .upload(path, file, { upsert: true });
    
    if (error) return null;
    
    const { data: urlData } = supabase.storage.from("logos").getPublicUrl(path);
    const logoUrl = urlData.publicUrl + "?t=" + Date.now();
    
    await updateSettings({ logo_url: logoUrl });
    return logoUrl;
  }, [user, updateSettings]);

  const removeLogo = useCallback(async () => {
    if (!user) return;
    const { data: files } = await supabase.storage.from("logos").list(user.id);
    if (files && files.length > 0) {
      await supabase.storage.from("logos").remove(files.map(f => `${user.id}/${f.name}`));
    }
    await updateSettings({ logo_url: "" });
  }, [user, updateSettings]);

  return { settings, loading, updateSettings, uploadLogo, removeLogo, refetch: fetchSettings };
}
