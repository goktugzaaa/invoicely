"use client";

import Link from "next/link";
import { useT, useI18n } from "@/lib/i18n/context";
import { formatCurrency, timeAgo } from "@/lib/utils";
import type { ActivityItem } from "@/services/dashboard";

const KIND_META: Record<
  ActivityItem["kind"],
  { dot: string; iconBg: string; iconStroke: string; path: string }
> = {
  invoice_created: {
    dot: "bg-brand-500",
    iconBg: "bg-brand-50",
    iconStroke: "text-brand-600",
    path: "M12 4v16m8-8H4",
  },
  invoice_sent: {
    dot: "bg-blue-500",
    iconBg: "bg-blue-50",
    iconStroke: "text-blue-600",
    path: "M3 12l18-9-9 18-2-7-7-2z",
  },
  invoice_paid: {
    dot: "bg-emerald-500",
    iconBg: "bg-emerald-50",
    iconStroke: "text-emerald-600",
    path: "M5 13l4 4L19 7",
  },
  client_created: {
    dot: "bg-amber-500",
    iconBg: "bg-amber-50",
    iconStroke: "text-amber-600",
    path: "M16 14a4 4 0 10-8 0M12 14v6m-7 0h14",
  },
};

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  const t = useT();
  const { locale } = useI18n();

  if (items.length === 0) {
    return (
      <div className="px-5 py-8 text-center text-sm text-slate-500">{t.dashboard.activityEmpty}</div>
    );
  }

  return (
    <ul className="divide-y divide-slate-100">
      {items.map((it) => {
        const meta = KIND_META[it.kind];
        let text = "";
        let href = "/invoices";
        let amount: string | null = null;

        if (it.kind === "client_created") {
          text = t.dashboard.actCreatedClient(it.client?.name ?? "—");
          href = it.client?.id ? `/clients/${it.client.id}` : "/clients";
        } else {
          const num = it.invoice?.number ?? "";
          const client = it.invoice?.client_name ?? "—";
          if (it.kind === "invoice_created") text = t.dashboard.actCreatedInvoice(num, client);
          else if (it.kind === "invoice_sent") text = t.dashboard.actSentInvoice(num, client);
          else if (it.kind === "invoice_paid") {
            text = t.dashboard.actPaidInvoice(num, client);
            amount = it.invoice
              ? formatCurrency(it.invoice.amount, it.invoice.currency)
              : null;
          }
          href = it.invoice?.id ? `/invoices/${it.invoice.id}` : "/invoices";
        }

        return (
          <li key={it.id} className="px-5 py-3">
            <Link href={href} className="group flex items-start gap-3">
              <span
                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${meta.iconBg} ${meta.iconStroke}`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d={meta.path} />
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-700 group-hover:text-slate-900">{text}</p>
                <p className="mt-0.5 text-xs text-slate-400">{timeAgo(it.at, locale)}</p>
              </div>
              {amount && (
                <span className="shrink-0 text-sm font-semibold text-emerald-600">+{amount}</span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
