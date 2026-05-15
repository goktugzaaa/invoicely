"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/dict";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const { locale } = useI18n();
  const router = useRouter();
  const [pending, start] = useTransition();

  function setLocale(next: Locale) {
    if (next === locale) return;
    start(async () => {
      await fetch("/api/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: next }),
      });
      router.refresh();
    });
  }

  return (
    <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white p-0.5 text-xs font-medium" aria-busy={pending}>
      {(["en", "tr"] as Locale[]).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          className={cn(
            "rounded-md px-2 py-1 uppercase transition-colors",
            locale === l ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
