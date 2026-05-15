import { cookies } from "next/headers";
import { dictionaries, isLocale, LOCALE_COOKIE, type Dict, type Locale } from "./dict";

export async function getLocale(): Promise<Locale> {
  const c = await cookies();
  const v = c.get(LOCALE_COOKIE)?.value;
  return isLocale(v) ? v : "en";
}

export async function getDict(): Promise<Dict> {
  const locale = await getLocale();
  return dictionaries[locale];
}
