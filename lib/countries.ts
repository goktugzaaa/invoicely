import type { Locale } from "@/lib/i18n/dict";

/**
 * Country presets for invoice localization.
 *
 * Note: Invoicely is NOT a substitute for country-specific government
 * e-invoicing systems (Italy SDI, Mexico CFDI, Brazil NF-e, Turkey e-Fatura,
 * Spain Verifactu, India GST e-invoicing, etc.). It produces clean,
 * client-acceptable PDF invoices for general freelance/agency use.
 *
 * For each country we expose:
 * - currency: default currency code
 * - taxLabel: "VAT" / "GST" / "KDV" etc — shown on invoice
 * - taxRate: typical default standard rate (informational only)
 * - locale: suggested UI language
 * - invoiceWord: localized word for "Invoice" used on PDF header
 * - taxIdLabel: localized label for the tax registration number
 * - supported: false flag for markets that need government e-invoicing
 *   (we still allow use but warn user)
 */
export interface CountryPreset {
  code: string; // ISO 3166-1 alpha-2
  name: string;
  currency: string;
  taxLabel: string;
  taxRate: number;
  locale: Locale;
  invoiceWord: string;
  taxIdLabel: string;
  /** true = our generic invoice meets common-use needs;
   *  false = local law requires government e-invoicing system we don't integrate with */
  supported: boolean;
  flag: string;
}

export const COUNTRIES: CountryPreset[] = [
  // English-speaking
  { code: "US", name: "United States", currency: "USD", taxLabel: "Sales Tax", taxRate: 0, locale: "en", invoiceWord: "Invoice", taxIdLabel: "EIN", supported: true, flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", currency: "GBP", taxLabel: "VAT", taxRate: 20, locale: "en", invoiceWord: "Invoice", taxIdLabel: "VAT No.", supported: true, flag: "🇬🇧" },
  { code: "CA", name: "Canada", currency: "CAD", taxLabel: "GST/HST", taxRate: 5, locale: "en", invoiceWord: "Invoice", taxIdLabel: "GST/HST No.", supported: true, flag: "🇨🇦" },
  { code: "AU", name: "Australia", currency: "AUD", taxLabel: "GST", taxRate: 10, locale: "en", invoiceWord: "Tax Invoice", taxIdLabel: "ABN", supported: true, flag: "🇦🇺" },
  { code: "NZ", name: "New Zealand", currency: "NZD" as string, taxLabel: "GST", taxRate: 15, locale: "en", invoiceWord: "Tax Invoice", taxIdLabel: "GST No.", supported: true, flag: "🇳🇿" },
  { code: "IE", name: "Ireland", currency: "EUR", taxLabel: "VAT", taxRate: 23, locale: "en", invoiceWord: "Invoice", taxIdLabel: "VAT No.", supported: true, flag: "🇮🇪" },

  // EU general
  { code: "DE", name: "Germany", currency: "EUR", taxLabel: "MwSt.", taxRate: 19, locale: "de", invoiceWord: "Rechnung", taxIdLabel: "USt-IdNr.", supported: true, flag: "🇩🇪" },
  { code: "AT", name: "Austria", currency: "EUR", taxLabel: "USt.", taxRate: 20, locale: "de", invoiceWord: "Rechnung", taxIdLabel: "UID-Nr.", supported: true, flag: "🇦🇹" },
  { code: "FR", name: "France", currency: "EUR", taxLabel: "TVA", taxRate: 20, locale: "fr", invoiceWord: "Facture", taxIdLabel: "N° TVA", supported: true, flag: "🇫🇷" },
  { code: "BE", name: "Belgium", currency: "EUR", taxLabel: "TVA", taxRate: 21, locale: "fr", invoiceWord: "Facture", taxIdLabel: "N° TVA", supported: true, flag: "🇧🇪" },
  { code: "NL", name: "Netherlands", currency: "EUR", taxLabel: "BTW", taxRate: 21, locale: "nl", invoiceWord: "Factuur", taxIdLabel: "BTW-nummer", supported: true, flag: "🇳🇱" },
  { code: "ES", name: "Spain", currency: "EUR", taxLabel: "IVA", taxRate: 21, locale: "es", invoiceWord: "Factura", taxIdLabel: "NIF/CIF", supported: true, flag: "🇪🇸" },
  { code: "PT", name: "Portugal", currency: "EUR", taxLabel: "IVA", taxRate: 23, locale: "es", invoiceWord: "Fatura", taxIdLabel: "NIF", supported: true, flag: "🇵🇹" },
  { code: "PL", name: "Poland", currency: "PLN" as string, taxLabel: "VAT", taxRate: 23, locale: "en", invoiceWord: "Faktura", taxIdLabel: "NIP", supported: true, flag: "🇵🇱" },
  { code: "SE", name: "Sweden", currency: "SEK" as string, taxLabel: "Moms", taxRate: 25, locale: "en", invoiceWord: "Faktura", taxIdLabel: "Org.nr.", supported: true, flag: "🇸🇪" },
  { code: "DK", name: "Denmark", currency: "DKK" as string, taxLabel: "Moms", taxRate: 25, locale: "en", invoiceWord: "Faktura", taxIdLabel: "CVR-nr.", supported: true, flag: "🇩🇰" },
  { code: "NO", name: "Norway", currency: "NOK" as string, taxLabel: "MVA", taxRate: 25, locale: "en", invoiceWord: "Faktura", taxIdLabel: "Org.nr.", supported: true, flag: "🇳🇴" },
  { code: "FI", name: "Finland", currency: "EUR", taxLabel: "ALV", taxRate: 24, locale: "en", invoiceWord: "Lasku", taxIdLabel: "Y-tunnus", supported: true, flag: "🇫🇮" },
  { code: "CH", name: "Switzerland", currency: "CHF", taxLabel: "MwSt.", taxRate: 8.1, locale: "de", invoiceWord: "Rechnung", taxIdLabel: "UID", supported: true, flag: "🇨🇭" },

  // Turkey
  { code: "TR", name: "Türkiye", currency: "TRY", taxLabel: "KDV", taxRate: 20, locale: "tr", invoiceWord: "Fatura", taxIdLabel: "VKN", supported: true, flag: "🇹🇷" },

  // MENA / APAC supported
  { code: "AE", name: "UAE", currency: "AED" as string, taxLabel: "VAT", taxRate: 5, locale: "en", invoiceWord: "Tax Invoice", taxIdLabel: "TRN", supported: true, flag: "🇦🇪" },
  { code: "SA", name: "Saudi Arabia", currency: "SAR" as string, taxLabel: "VAT", taxRate: 15, locale: "en", invoiceWord: "Tax Invoice", taxIdLabel: "VAT No.", supported: true, flag: "🇸🇦" },
  { code: "ZA", name: "South Africa", currency: "ZAR" as string, taxLabel: "VAT", taxRate: 15, locale: "en", invoiceWord: "Tax Invoice", taxIdLabel: "VAT No.", supported: true, flag: "🇿🇦" },
  { code: "SG", name: "Singapore", currency: "SGD" as string, taxLabel: "GST", taxRate: 9, locale: "en", invoiceWord: "Tax Invoice", taxIdLabel: "GST Reg. No.", supported: true, flag: "🇸🇬" },
  { code: "HK", name: "Hong Kong", currency: "HKD" as string, taxLabel: "—", taxRate: 0, locale: "en", invoiceWord: "Invoice", taxIdLabel: "BR No.", supported: true, flag: "🇭🇰" },
  { code: "JP", name: "Japan", currency: "JPY", taxLabel: "JCT", taxRate: 10, locale: "en", invoiceWord: "Invoice", taxIdLabel: "Tax No.", supported: true, flag: "🇯🇵" },

  // Markets where local e-invoicing is mandated — we still allow general use
  { code: "IT", name: "Italy", currency: "EUR", taxLabel: "IVA", taxRate: 22, locale: "fr", invoiceWord: "Fattura", taxIdLabel: "Partita IVA", supported: false, flag: "🇮🇹" },
  { code: "MX", name: "Mexico", currency: "MXN" as string, taxLabel: "IVA", taxRate: 16, locale: "es", invoiceWord: "Factura", taxIdLabel: "RFC", supported: false, flag: "🇲🇽" },
  { code: "BR", name: "Brazil", currency: "BRL" as string, taxLabel: "ICMS", taxRate: 18, locale: "es", invoiceWord: "Fatura", taxIdLabel: "CNPJ", supported: false, flag: "🇧🇷" },
  { code: "IN", name: "India", currency: "INR" as string, taxLabel: "GST", taxRate: 18, locale: "en", invoiceWord: "Tax Invoice", taxIdLabel: "GSTIN", supported: false, flag: "🇮🇳" },
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

export const SUPPORTED_COUNTRIES = COUNTRIES.filter((c) => c.supported);
export const RESTRICTED_COUNTRIES = COUNTRIES.filter((c) => !c.supported);
