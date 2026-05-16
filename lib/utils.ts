import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SUPPORTED_CURRENCIES = [
  "USD", "EUR", "GBP", "TRY", "CAD", "AUD", "NZD",
  "CHF", "SEK", "NOK", "DKK", "PLN", "ZAR", "SGD", "HKD",
  "JPY",
] as const;
export type Currency = (typeof SUPPORTED_CURRENCIES)[number];

export function formatCurrency(value: number | string, currency = "USD") {
  const n = typeof value === "string" ? parseFloat(value) : value;
  if (Number.isNaN(n)) return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(0);
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n);
  } catch {
    return `${currency} ${n.toFixed(2)}`;
  }
}

export function formatDate(
  d: string | Date | null | undefined,
  locale: string = "en-US"
) {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  const tag = LOCALE_TAGS[locale] ?? locale;
  try {
    return date.toLocaleDateString(tag, { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  }
}

export function isOverdue(dueDate: string | null, status: string) {
  if (!dueDate || status === "paid" || status === "draft") return false;
  return new Date(dueDate) < new Date();
}

const LOCALE_TAGS: Record<string, string> = {
  en: "en-US",
  tr: "tr-TR",
  de: "de-DE",
  es: "es-ES",
  fr: "fr-FR",
  nl: "nl-NL",
};

export function timeAgo(date: string | Date, locale: string = "en"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const diffSec = Math.round((Date.now() - d.getTime()) / 1000);
  const tag = LOCALE_TAGS[locale] ?? "en-US";
  const rtf = new Intl.RelativeTimeFormat(tag, { numeric: "auto" });
  if (diffSec < 60) return rtf.format(-diffSec, "second");
  const min = Math.round(diffSec / 60);
  if (min < 60) return rtf.format(-min, "minute");
  const hr = Math.round(min / 60);
  if (hr < 24) return rtf.format(-hr, "hour");
  const day = Math.round(hr / 24);
  if (day < 30) return rtf.format(-day, "day");
  const mon = Math.round(day / 30);
  if (mon < 12) return rtf.format(-mon, "month");
  return rtf.format(-Math.round(mon / 12), "year");
}
