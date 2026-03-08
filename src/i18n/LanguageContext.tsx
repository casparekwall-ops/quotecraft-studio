import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import en, { TranslationKeys } from "./translations/en";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type Language = "en" | "sv" | "de" | "es" | "fr" | "zh" | "pt";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKeys;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: en,
});

const translationModules: Record<Language, () => Promise<{ default: TranslationKeys }>> = {
  en: () => import("./translations/en"),
  sv: () => import("./translations/sv"),
  de: () => import("./translations/de"),
  es: () => import("./translations/es"),
  fr: () => import("./translations/fr"),
  zh: () => import("./translations/zh"),
  pt: () => import("./translations/pt"),
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [language, setLanguageState] = useState<Language>("en");
  const [translations, setTranslations] = useState<TranslationKeys>(en);

  // Load language from profile on login
  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("language")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.language && data.language !== language) {
          loadLanguage(data.language as Language);
        }
      });
  }, [user?.id]);

  const loadLanguage = useCallback(async (lang: Language) => {
    try {
      const mod = await translationModules[lang]();
      setTranslations(mod.default);
      setLanguageState(lang);
    } catch {
      // fallback to English
      setTranslations(en);
      setLanguageState("en");
    }
  }, []);

  const setLanguage = useCallback(async (lang: Language) => {
    await loadLanguage(lang);
    // Persist to profile
    if (user) {
      await supabase.from("profiles").update({ language: lang } as any).eq("id", user.id);
    }
  }, [user, loadLanguage]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
export type { Language };
