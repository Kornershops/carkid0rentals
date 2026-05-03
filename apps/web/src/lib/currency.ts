export type CurrencyCode = "NGN" | "KES" | "ZAR" | "GHS" | "EGP" | "USD";

export const CURRENCIES: Record<CurrencyCode, { symbol: string; rate: number; name: string }> = {
  USD: { symbol: "$", rate: 1, name: "US Dollar" },
  NGN: { symbol: "₦", rate: 1600, name: "Nigerian Naira" },
  KES: { symbol: "KSh", rate: 130, name: "Kenyan Shilling" },
  ZAR: { symbol: "R", rate: 19, name: "South African Rand" },
  GHS: { symbol: "GH₵", rate: 15, name: "Ghanaian Cedi" },
  EGP: { symbol: "E£", rate: 48, name: "Egyptian Pound" },
};

export function formatPrice(amountInUSD: number, targetCurrency: CurrencyCode = "NGN") {
  const config = CURRENCIES[targetCurrency];
  const converted = amountInUSD * config.rate;
  
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: targetCurrency === "USD" ? "USD" : targetCurrency,
    currencyDisplay: "symbol",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(converted).replace(targetCurrency, config.symbol);
}

export function getCurrencyForCountry(country: string): CurrencyCode {
  switch (country) {
    case "Kenya": return "KES";
    case "South Africa": return "ZAR";
    case "Ghana": return "GHS";
    case "Egypt": return "EGP";
    case "Nigeria": return "NGN";
    default: return "USD";
  }
}
