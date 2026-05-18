"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n/context";
import { formatCurrency, cn } from "@/lib/utils";
import type { StatusBucket } from "@/services/invoices";
import type { InvoiceStatus } from "@/types/db";

const TONES: Record<
  InvoiceStatus,
  { label: keyof ReturnType<typeof useT>["status"]; glow: string; valueColor: string; ring: string }
> = {
  draft: {
    label: "draft",
    glow: "glow-slate",
    valueColor: "text-slate-900 dark:text-slate-100",
    ring: "ring-slate-200 dark:ring-white/10",
  },
  sent: {
    label: "sent",
    glow: "glow-amber",
    valueColor: "text-amber-700 dark:text-amber-300",
    ring: "ring-amber-200 dark:ring-amber-900/40",
  },
  overdue: {
    label: "overdue",
    glow: "glow-rose",
    valueColor: "text-rose-700 dark:text-rose-300",
    ring: "ring-rose-200 dark:ring-rose-900/40",
  },
  paid: {
    label: "paid",
    glow: "glow-emerald",
    valueColor: "text-emerald-700 dark:text-emerald-300",
    ring: "ring-emerald-200 dark:ring-emerald-900/40",
  },
};

const ORDER: InvoiceStatus[] = ["draft", "sent", "overdue", "paid"];

export function StatusKpiStrip({
  byStatus,
  currency,
}: {
  byStatus: Record<InvoiceStatus, StatusBucket>;
  currency: string;
}) {
  const t = useT();
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {ORDER.map((status) => {
        const b = byStatus[status];
        const tone = TONES[status];
        const label = t.status[tone.label];
        return (
          <Link
            key={status}
            href={`/invoices?status=${status}`}
            className={cn(
              "group glass relative overflow-hidden rounded-2xl p-5 ring-1 ring-inset transition-all hover:-translate-y-0.5",
              tone.ring,
              `dark:${tone.glow}`
            )}
          >
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              <span className={cn("inline-flex h-1.5 w-1.5 rounded-full", {
                "bg-slate-400 dark:bg-slate-500": status === "draft",
                "bg-amber-500": status === "sent",
                "bg-rose-500": status === "overdue",
                "bg-emerald-500": status === "paid",
              })} />
              {label}
            </div>
            <div className={cn("mt-3 text-3xl font-semibold tabular-nums tracking-[-0.025em] sm:text-4xl", tone.valueColor)}>
              {formatCurrency(b.amount, currency)}
            </div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {t.invoices.summaryCount(b.count)}
              <span className="ml-2 font-mono text-[10px] uppercase tracking-widest opacity-0 transition-opacity group-hover:opacity-100">
                view →
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
