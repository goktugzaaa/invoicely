"use client";

import { createContext, useContext } from "react";
import { dictionaries, type Dict, type Locale } from "./dict";

interface I18nValue {
  locale: Locale;
  t: Dict;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const value: I18nValue = { locale, t: dictionaries[locale] };
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

export function useT(): Dict {
  return useI18n().t;
}
