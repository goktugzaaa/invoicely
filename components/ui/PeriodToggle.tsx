"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useT } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

export type Period = "week" | "month" | "quarter" | "year" | "all";

const ORDER: Period[] = ["week", "month", "quarter", "year", "all"];

export function PeriodToggle({ value }: { value: Period }) {
  const t = useT();
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [pending, start] = useTransition();

  const labels: Record<Period, string> = {
    week: t.invoices.periodWeek,
    month: t.invoices.periodMonth,
    quarter: t.invoices.periodQuarter,
    year: t.invoices.periodYear,
    all: t.invoices.periodAll,
  };

  function setPeriod(p: Period) {
    if (p === value || pending) return;
    const params = new URLSearchParams(sp.toString());
    if (p === "all") params.delete("period");
    else params.set("period", p);
    params.delete("page");
    start(() => router.push(`${pathname}?${params.toString()}`, { scroll: false }));
  }

  return (
    <div
      className="inline-flex items-center rounded-lg border border-slate-200 bg-white p-0.5 text-xs font-medium dark:border-white/15 dark:bg-white/[0.04]"
      aria-busy={pending}
    >
      {ORDER.map((p) => {
        const active = value === p;
        return (
          <button
            key={p}
            type="button"
            onClick={() => setPeriod(p)}
            disabled={pending}
            className={cn(
              "rounded-md px-3 py-1 transition-colors",
              active
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/[0.06]",
              pending && !active && "cursor-not-allowed opacity-50"
            )}
          >
            {labels[p]}
          </button>
        );
      })}
    </div>
  );
}
