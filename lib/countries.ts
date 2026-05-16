/**
 * Country presets for invoice localization.
 *
 * Scope: Paidly produces casual freelance / small-agency invoices that are
 * accepted in jurisdictions where government e-invoicing systems are NOT
 * mandatory for our target users (freelancers and small businesses below
 * any e-invoicing threshold).
 *
 * Countries excluded because their local law requires government
 * e-invoicing systems we don't integrate with:
 *   - Italy (SDI), Mexico (CFDI), Brazil (NF-e), India (GST e-invoicing),
 *     Japan (Qualified Invoice System), UAE/Saudi (ZATCA / Arabic format).
 *
 * For each country we expose:
 * - currency: default currency code
 * - taxLabel: "VAT" / "GST" / "KDV" / ...
 * - taxRate: typical default standard rate (informational only)
 * - dateLocale: BCP 47 tag used for date/number formatting on PDF
 * - invoiceWord: localized word for "Invoice" used on PDF header
 * - taxIdLabel: localized label for the seller's tax registration number
 */
export interface CountryPreset {
  code: string; // ISO 3166-1 alpha-2
  name: string;
  currency: string;
  taxLabel: string;
  taxRate: number;
  /** BCP 47 sub-locale used for date/number formatting (e.g. "en", "de", "fr") */
  locale: string;
  invoiceWord: string;
  taxIdLabel: string;
  flag: string;
}

export const COUNTRIES: CountryPreset[] = [
  // English-speaking
  { code: "US", name: "United States", currency: "USD", taxLabel: "Sales Tax", taxRate: 0, locale: "en", invoiceWord: "Invoice", taxIdLabel: "EIN", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", currency: "GBP", taxLabel: "VAT", taxRate: 20, locale: "en", invoiceWord: "Invoice", taxIdLabel: "VAT No.", flag: "🇬🇧" },
  { code: "CA", name: "Canada", currency: "CAD", taxLabel: "GST/HST", taxRate: 5, locale: "en", invoiceWord: "Invoice", taxIdLabel: "GST/HST No.", flag: "🇨🇦" },
  { code: "AU", name: "Australia", currency: "AUD", taxLabel: "GST", taxRate: 10, locale: "en", invoiceWord: "Tax Invoice", taxIdLabel: "ABN", flag: "🇦🇺" },
  { code: "NZ", name: "New Zealand", currency: "NZD", taxLabel: "GST", taxRate: 15, locale: "en", invoiceWord: "Tax Invoice", taxIdLabel: "GST No.", flag: "🇳🇿" },
  { code: "IE", name: "Ireland", currency: "EUR", taxLabel: "VAT", taxRate: 23, locale: "en", invoiceWord: "Invoice", taxIdLabel: "VAT No.", flag: "🇮🇪" },

  // EU / EEA general
  { code: "DE", name: "Germany", currency: "EUR", taxLabel: "MwSt.", taxRate: 19, locale: "de", invoiceWord: "Rechnung", taxIdLabel: "USt-IdNr.", flag: "🇩🇪" },
  { code: "AT", name: "Austria", currency: "EUR", taxLabel: "USt.", taxRate: 20, locale: "de", invoiceWord: "Rechnung", taxIdLabel: "UID-Nr.", flag: "🇦🇹" },
  { code: "FR", name: "France", currency: "EUR", taxLabel: "TVA", taxRate: 20, locale: "fr", invoiceWord: "Facture", taxIdLabel: "N° TVA", flag: "🇫🇷" },
  { code: "BE", name: "Belgium", currency: "EUR", taxLabel: "TVA", taxRate: 21, locale: "fr", invoiceWord: "Facture", taxIdLabel: "N° TVA", flag: "🇧🇪" },
  { code: "NL", name: "Netherlands", currency: "EUR", taxLabel: "BTW", taxRate: 21, locale: "nl", invoiceWord: "Factuur", taxIdLabel: "BTW-nummer", flag: "🇳🇱" },
  { code: "ES", name: "Spain", currency: "EUR", taxLabel: "IVA", taxRate: 21, locale: "es", invoiceWord: "Factura", taxIdLabel: "NIF/CIF", flag: "🇪🇸" },
  { code: "PT", name: "Portugal", currency: "EUR", taxLabel: "IVA", taxRate: 23, locale: "pt", invoiceWord: "Fatura", taxIdLabel: "NIF", flag: "🇵🇹" },
  { code: "PL", name: "Poland", currency: "PLN", taxLabel: "VAT", taxRate: 23, locale: "pl", invoiceWord: "Faktura", taxIdLabel: "NIP", flag: "🇵🇱" },
  { code: "SE", name: "Sweden", currency: "SEK", taxLabel: "Moms", taxRate: 25, locale: "sv", invoiceWord: "Faktura", taxIdLabel: "Org.nr.", flag: "🇸🇪" },
  { code: "DK", name: "Denmark", currency: "DKK", taxLabel: "Moms", taxRate: 25, locale: "da", invoiceWord: "Faktura", taxIdLabel: "CVR-nr.", flag: "🇩🇰" },
  { code: "NO", name: "Norway", currency: "NOK", taxLabel: "MVA", taxRate: 25, locale: "no", invoiceWord: "Faktura", taxIdLabel: "Org.nr.", flag: "🇳🇴" },
  { code: "FI", name: "Finland", currency: "EUR", taxLabel: "ALV", taxRate: 24, locale: "fi", invoiceWord: "Lasku", taxIdLabel: "Y-tunnus", flag: "🇫🇮" },
  { code: "CH", name: "Switzerland", currency: "CHF", taxLabel: "MwSt.", taxRate: 8.1, locale: "de", invoiceWord: "Rechnung", taxIdLabel: "UID", flag: "🇨🇭" },

  // Turkey (under e-Fatura threshold)
  { code: "TR", name: "Türkiye", currency: "TRY", taxLabel: "KDV", taxRate: 20, locale: "tr", invoiceWord: "Fatura", taxIdLabel: "VKN", flag: "🇹🇷" },

  // Other supported markets (casual / B2B small)
  { code: "ZA", name: "South Africa", currency: "ZAR", taxLabel: "VAT", taxRate: 15, locale: "en", invoiceWord: "Tax Invoice", taxIdLabel: "VAT No.", flag: "🇿🇦" },
  { code: "SG", name: "Singapore", currency: "SGD", taxLabel: "GST", taxRate: 9, locale: "en", invoiceWord: "Tax Invoice", taxIdLabel: "GST Reg. No.", flag: "🇸🇬" },
  { code: "HK", name: "Hong Kong", currency: "HKD", taxLabel: "—", taxRate: 0, locale: "en", invoiceWord: "Invoice", taxIdLabel: "BR No.", flag: "🇭🇰" },
];

export const COUNTRY_BY_CODE = new Map(COUNTRIES.map((c) => [c.code, c]));

export function getCountry(code?: string | null): CountryPreset | null {
  if (!code) return null;
  return COUNTRY_BY_CODE.get(code.toUpperCase()) ?? null;
}

/** Localized "Invoice" word for the seller's country (defaults to "Invoice") */
export function invoiceWord(countryCode?: string | null): string {
  return getCountry(countryCode)?.invoiceWord ?? "Invoice";
}

/**
 * BCP 47 locale tag for date/number formatting per country.
 * en-US, en-GB, de-DE, tr-TR, fr-FR, etc.
 * Falls back to "en-US" when country unknown.
 */
export function getDateLocale(countryCode?: string | null): string {
  const c = getCountry(countryCode);
  if (!c) return "en-US";
  return `${c.locale}-${c.code}`;
}

export const SUPPORTED_COUNTRIES = COUNTRIES;
export const RESTRICTED_COUNTRIES: CountryPreset[] = [];
