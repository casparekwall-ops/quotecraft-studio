import { useLanguage, Language } from "@/i18n/LanguageContext";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages: { code: Language; flag: string; label: string; short: string }[] = [
  { code: "en", flag: "🇬🇧", label: "English", short: "EN" },
  { code: "sv", flag: "🇸🇪", label: "Svenska", short: "SV" },
  { code: "de", flag: "🇩🇪", label: "Deutsch", short: "DE" },
  { code: "es", flag: "🇪🇸", label: "Español", short: "ES" },
  { code: "fr", flag: "🇫🇷", label: "Français", short: "FR" },
  { code: "zh", flag: "🇨🇳", label: "中文", short: "ZH" },
  { code: "pt", flag: "🇧🇷", label: "Português", short: "PT" },
];

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const current = languages.find(l => l.code === language) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
          <Globe className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{current.flag} {current.short}</span>
          <span className="sm:hidden">{current.flag}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`gap-2.5 text-[13px] ${lang.code === language ? "bg-accent font-medium" : ""}`}
          >
            <span className="text-base leading-none">{lang.flag}</span>
            <span>{lang.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
