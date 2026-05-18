"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n/context";
import { formatCurrency } from "@/lib/utils";
import type { TopClient } from "@/services/reports";

export function TopClients({ clients }: { clients: TopClient[] }) {
  const t = useT();
  if (clients.length === 0) {
    return (
      <div className="px-5 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
        {t.topClients.empty}
      </div>
    );
  }
  const max = clients[0]?.total ?? 0;
  return (
    <ul className="divide-y divide-slate-100 dark:divide-white/10">
      {clients.map((c, i) => {
        const pct = max > 0 ? (c.total / max) * 100 : 0;
        return (
          <li key={c.id} className="px-5 py-3">
            <Link href={`/clients/${c.id}`} className="group block">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="flex min-w-0 items-center gap-3">
                  <span className="font-mono text-xs text-slate-400 dark:text-slate-500">0{i + 1}</span>
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-slate-900 group-hover:text-brand-700 dark:text-slate-100 dark:group-hover:text-brand-400">
                      {c.name}
                    </span>
                    {c.company && (
                      <span className="block truncate text-xs text-slate-500 dark:text-slate-400">{c.company}</span>
                    )}
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block font-semibold text-slate-900 tabular-nums dark:text-slate-100">
                    {formatCurrency(c.total, c.currency)}
                  </span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400">
                    {t.topClients.invoiceCount(c.invoiceCount)}
                  </span>
                </span>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-100 dark:bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-brand-gradient transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
