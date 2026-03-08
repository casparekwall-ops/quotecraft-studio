import { useLanguage, Language } from "@/i18n/LanguageContext";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languageFlags: Record<Language, string> = {
  en: "🇬🇧",
  sv: "🇸🇪",
  de: "🇩🇪",
  es: "🇪🇸",
  fr: "🇫🇷",
  zh: "🇨🇳",
  pt: "🇧🇷",
};

const LanguageSwitcher = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{languageFlags[language]} {t.languages[language]}</span>
          <span className="sm:hidden">{languageFlags[language]}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {(Object.keys(languageFlags) as Language[]).map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => setLanguage(lang)}
            className={lang === language ? "bg-accent font-medium" : ""}
          >
            <span className="mr-2">{languageFlags[lang]}</span>
            {t.languages[lang]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
