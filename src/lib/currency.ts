export type CurrencyCode = "SEK" | "EUR" | "USD" | "GBP" | "NOK" | "DKK" | "CHF";

export const SUPPORTED_CURRENCIES: { code: CurrencyCode; symbol: string; label: string; flag: string }[] = [
  { code: "USD", symbol: "$", label: "US Dollar", flag: "🇺🇸" },
  { code: "EUR", symbol: "€", label: "Euro", flag: "🇪🇺" },
  { code: "SEK", symbol: "kr", label: "Swedish Krona", flag: "🇸🇪" },
  { code: "GBP", symbol: "£", label: "British Pound", flag: "🇬🇧" },
  { code: "NOK", symbol: "kr", label: "Norwegian Krone", flag: "🇳🇴" },
  { code: "DKK", symbol: "kr", label: "Danish Krone", flag: "🇩🇰" },
  { code: "CHF", symbol: "CHF", label: "Swiss Franc", flag: "🇨🇭" },
];

const LOCALE_MAP: Record<CurrencyCode, string> = {
  USD: "en-US",
  EUR: "de-DE",
  SEK: "sv-SE",
  GBP: "en-GB",
  NOK: "nb-NO",
  DKK: "da-DK",
  CHF: "de-CH",
};

export function formatCurrency(amount: number, currency: CurrencyCode = "USD"): string {
  const locale = LOCALE_MAP[currency] || "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function getCurrencySymbol(currency: CurrencyCode): string {
  return SUPPORTED_CURRENCIES.find(c => c.code === currency)?.symbol || currency;
}
