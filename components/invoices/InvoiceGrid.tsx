"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n/context";
import { formatCurrency, formatDate, isOverdue, cn } from "@/lib/utils";
import type { InvoiceStatus, InvoiceWithClient } from "@/types/db";

const STATUS_TONE: Record<InvoiceStatus, { dot: string; tag: string; ring: string }> = {
  draft: {
    dot: "bg-slate-400 dark:bg-slate-500",
    tag: "bg-slate-100 text-slate-600 dark:bg-white/[0.06] dark:text-slate-300",
    ring: "ring-slate-200/60 dark:ring-white/10 hover:ring-slate-300 dark:hover:ring-white/20",
  },
  sent: {
    dot: "bg-amber-500",
    tag: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
    ring: "ring-amber-200/60 dark:ring-amber-900/30 hover:ring-amber-300 dark:hover:ring-amber-700/50",
  },
  overdue: {
    dot: "bg-rose-500",
    tag: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
    ring: "ring-rose-200/60 dark:ring-rose-900/40 hover:ring-rose-300 dark:hover:ring-rose-700/60",
  },
  paid: {
    dot: "bg-emerald-500",
    tag: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    ring: "ring-emerald-200/60 dark:ring-emerald-900/30 hover:ring-emerald-300 dark:hover:ring-emerald-700/50",
  },
};

export function InvoiceGrid({ invoices }: { invoices: InvoiceWithClient[] }) {
  const t = useT();
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {invoices.map((inv) => {
        const overdue = isOverdue(inv.due_date, inv.status);
        const displayStatus = (overdue && inv.status === "sent" ? "overdue" : inv.status) as InvoiceStatus;
        const tone = STATUS_TONE[displayStatus];
        const label = t.status[displayStatus];
        const titleText = inv.notes?.split("\n")[0]?.slice(0, 28) || label;
        return (
          <Link
            key={inv.id}
            href={`/invoices/${inv.id}`}
            className={cn(
              "group glass flex flex-col rounded-2xl p-5 ring-1 ring-inset transition-all hover:-translate-y-0.5",
              tone.ring,
              displayStatus === "paid" && "dark:glow-emerald",
              displayStatus === "overdue" && "dark:glow-rose"
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <span className={cn("inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest", tone.tag)}>
                <span className={cn("h-1 w-1 rounded-full", tone.dot)} />
                {titleText}
              </span>
              <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
                {inv.invoice_number}
              </span>
            </div>

            <div className={cn(
              "mt-5 text-3xl font-semibold tabular-nums tracking-[-0.025em]",
              displayStatus === "paid"
                ? "text-emerald-700 dark:text-emerald-300"
                : displayStatus === "overdue"
                  ? "text-rose-700 dark:text-rose-300"
                  : "text-slate-900 dark:text-slate-100"
            )}>
              {formatCurrency(inv.total_amount, inv.currency || "USD")}
            </div>

            <div className="mt-6 flex items-end justify-between gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 truncate rounded-md bg-slate-100 px-2 py-1 text-slate-700 dark:bg-white/[0.06] dark:text-slate-300">
                {inv.client?.name ?? "—"}
              </span>
              <span className="font-mono tabular-nums text-slate-400 dark:text-slate-500">
                {formatDate(inv.issue_date)}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
