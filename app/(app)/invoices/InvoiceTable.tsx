"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Table, THead, TR, TH, TD } from "@/components/ui/Table";
import { formatCurrency, formatDate, isOverdue, cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/context";
import { bulkUpdateInvoiceStatusAction, bulkDeleteInvoicesAction } from "./actions";
import type { InvoiceStatus, InvoiceWithClient } from "@/types/db";

export function InvoiceTable({ invoices }: { invoices: InvoiceWithClient[] }) {
  const t = useT();
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pending, start] = useTransition();

  const allSelected = invoices.length > 0 && selected.size === invoices.length;
  const someSelected = selected.size > 0 && selected.size < invoices.length;

  function toggleOne(id: string) {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  function toggleAll() {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(invoices.map((i) => i.id)));
  }
  function clear() {
    setSelected(new Set());
  }

  function bulkStatus(status: InvoiceStatus) {
    const ids = Array.from(selected);
    if (!confirm(t.bulk.confirm(ids.length))) return;
    start(async () => {
      const r = await bulkUpdateInvoiceStatusAction(ids, status);
      if (r && "error" in r) {
        alert(r.error);
        return;
      }
      clear();
      router.refresh();
    });
  }
  function bulkDelete() {
    const ids = Array.from(selected);
    if (!confirm(t.bulk.confirm(ids.length))) return;
    start(async () => {
      const r = await bulkDeleteInvoicesAction(ids);
      if (r && "error" in r) {
        alert(r.error);
        return;
      }
      clear();
      router.refresh();
    });
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/[0.04]">
      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-brand-50/60 px-4 py-2.5 text-sm dark:border-white/10 dark:bg-brand-950/30">
          <span className="font-medium text-brand-700 dark:text-brand-300">{t.bulk.selected(selected.size)}</span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => bulkStatus("paid")}
              disabled={pending}
              className="rounded-md bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {t.bulk.markPaid}
            </button>
            <button
              type="button"
              onClick={() => bulkStatus("sent")}
              disabled={pending}
              className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {t.bulk.markSent}
            </button>
            <button
              type="button"
              onClick={bulkDelete}
              disabled={pending}
              className="rounded-md bg-rose-600 px-3 py-1 text-xs font-medium text-white hover:bg-rose-700 disabled:opacity-50"
            >
              {t.bulk.delete}
            </button>
            <button
              type="button"
              onClick={clear}
              className="rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              {t.bulk.clear}
            </button>
          </div>
        </div>
      )}

      <Table className="border-0">
        <THead>
          <tr>
            <TH className="w-10">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someSelected;
                }}
                onChange={toggleAll}
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 dark:border-slate-600 dark:bg-white/[0.04]"
                aria-label="Select all"
              />
            </TH>
            <TH>{t.invoices.title}</TH>
            <TH>{t.nav.clients}</TH>
            <TH>{t.common.issued}</TH>
            <TH>{t.common.due}</TH>
            <TH>{t.common.status}</TH>
            <TH className="text-right">{t.common.amount}</TH>
            <TH className="w-12"></TH>
          </tr>
        </THead>
        <tbody>
          {invoices.map((inv) => {
            const overdue = isOverdue(inv.due_date, inv.status);
            const displayStatus = (overdue && inv.status === "sent" ? "overdue" : inv.status) as InvoiceStatus;
            const isChecked = selected.has(inv.id);
            return (
              <TR key={inv.id} className={cn(isChecked && "bg-brand-50/40 dark:bg-brand-950/30")}>
                <TD>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleOne(inv.id)}
                    className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 dark:border-slate-600 dark:bg-white/[0.04]"
                    aria-label={`Select ${inv.invoice_number}`}
                  />
                </TD>
                <TD className="font-medium text-slate-900 dark:text-slate-100">
                  <Link href={`/invoices/${inv.id}`} className="hover:text-brand-700 dark:hover:text-brand-400">
                    {inv.invoice_number}
                  </Link>
                </TD>
                <TD>{inv.client?.name ?? "—"}</TD>
                <TD>{formatDate(inv.issue_date)}</TD>
                <TD>{formatDate(inv.due_date)}</TD>
                <TD>
                  <Badge value={displayStatus} label={t.status[displayStatus]} />
                </TD>
                <TD className="text-right font-medium">
                  {formatCurrency(inv.total_amount, inv.currency || "USD")}
                </TD>
                <TD className="text-right">
                  <a
                    href={`/api/invoices/${inv.id}/pdf`}
                    target="_blank"
                    rel="noreferrer"
                    title="PDF"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-brand-600"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m-9 7h12a2 2 0 002-2V7a2 2 0 00-2-2h-4l-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </a>
                </TD>
              </TR>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
