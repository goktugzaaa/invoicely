"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useT } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import type { DashboardRange } from "@/services/dashboard";

const RANGES: DashboardRange[] = ["7d", "30d", "90d", "12m"];

export function RangeToggle({ value }: { value: DashboardRange }) {
  const t = useT();
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [pending, start] = useTransition();
  const [target, setTarget] = useState<DashboardRange | null>(null);

  function setRange(r: DashboardRange) {
    if (r === value || pending) return;
    setTarget(r);
    const params = new URLSearchParams(sp.toString());
    params.set("range", r);
    start(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  const labelMap: Record<DashboardRange, string> = {
    "7d": t.dashboard.range7d,
    "30d": t.dashboard.range30d,
    "90d": t.dashboard.range90d,
    "12m": t.dashboard.range12m,
    all: "all",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border border-slate-200 bg-white p-0.5 text-xs font-medium transition-opacity",
        pending && "opacity-90"
      )}
      aria-busy={pending}
    >
      {RANGES.map((r) => {
        const isActive = value === r;
        const isLoading = pending && target === r;
        return (
          <button
            key={r}
            type="button"
            onClick={() => setRange(r)}
            disabled={pending}
            className={cn(
              "relative inline-flex min-w-[44px] items-center justify-center gap-1 rounded-md px-2.5 py-1 transition-colors",
              isActive
                ? "bg-slate-900 text-white"
                : isLoading
                  ? "bg-slate-100 text-slate-700"
                  : "text-slate-600 hover:bg-slate-100",
              pending && !isLoading && !isActive && "cursor-not-allowed opacity-50"
            )}
          >
            {isLoading && (
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
            )}
            <span>{labelMap[r]}</span>
          </button>
        );
      })}
    </div>
  );
}
