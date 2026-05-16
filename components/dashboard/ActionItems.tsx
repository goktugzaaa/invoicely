"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n/context";
import { formatCurrency } from "@/lib/utils";
import type { ActionItem } from "@/services/actions";

const KIND_META: Record<
  ActionItem["kind"],
  { dot: string; bg: string }
> = {
  chase_overdue: { dot: "bg-rose-500", bg: "bg-rose-50" },
  send_draft: { dot: "bg-amber-500", bg: "bg-amber-50" },
  due_soon: { dot: "bg-blue-500", bg: "bg-blue-50" },
  just_paid: { dot: "bg-emerald-500", bg: "bg-emerald-50" },
};

export function ActionItems({ items }: { items: ActionItem[] }) {
  const t = useT();

  if (items.length === 0) {
    return (
      <div className="flex items-center gap-3 px-5 py-4 text-sm">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3.5 w-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <span className="text-slate-600">{t.actions.empty}</span>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-slate-100">
      {items.map((it) => {
        const meta = KIND_META[it.kind];
        let text = "";
        if (it.kind === "send_draft") text = t.actions.sendDraft(it.invoiceNumber, it.days);
        else if (it.kind === "chase_overdue") text = t.actions.chaseOverdue(it.invoiceNumber, it.clientName ?? "—", it.days);
        else if (it.kind === "due_soon") text = t.actions.dueSoon(it.invoiceNumber, it.clientName ?? "—", it.days);
        else if (it.kind === "just_paid") text = t.actions.justPaid(it.invoiceNumber, it.clientName ?? "—");
        return (
          <li key={`${it.kind}-${it.invoiceId}`}>
            <Link
              href={`/invoices/${it.invoiceId}`}
              className="group flex items-center gap-3 px-5 py-2 transition-colors hover:bg-slate-50"
            >
              <span className={`inline-flex h-1.5 w-1.5 shrink-0 rounded-full ${meta.dot}`} />
              <span className="min-w-0 flex-1 truncate text-sm text-slate-800">{text}</span>
              <span className="shrink-0 font-mono text-xs tabular-nums text-slate-500">
                {formatCurrency(it.amount, it.currency)}
              </span>
              <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-slate-300 transition-colors group-hover:text-brand-600">
                →
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
