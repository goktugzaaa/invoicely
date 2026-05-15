"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { formatCurrency, SUPPORTED_CURRENCIES } from "@/lib/utils";
import { useT } from "@/lib/i18n/context";
import type { InvoiceWithItems } from "@/types/db";

type ClientOption = { id: string; name: string; company: string | null };
type ItemRow = { description: string; quantity: number; unit_price: number };

type Props = {
  clients: ClientOption[];
  initial?: InvoiceWithItems;
  defaultClientId?: string;
  defaultCurrency?: string;
  action: (formData: FormData) => Promise<{ ok: false; error: string } | void>;
  submitLabel: string;
  showPdfCta?: boolean;
};

const today = () => new Date().toISOString().slice(0, 10);

export function InvoiceForm({
  clients,
  initial,
  defaultClientId,
  defaultCurrency = "USD",
  action,
  submitLabel,
  showPdfCta,
}: Props) {
  const t = useT();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [openPdfNext, setOpenPdfNext] = useState(false);

  const [items, setItems] = useState<ItemRow[]>(
    initial?.items?.map((i) => ({
      description: i.description,
      quantity: Number(i.quantity),
      unit_price: Number(i.unit_price),
    })) ?? [{ description: "", quantity: 1, unit_price: 0 }]
  );
  const [currency, setCurrency] = useState<string>(initial?.currency ?? defaultCurrency);
  const [taxRate, setTaxRate] = useState<number>(Number(initial?.tax_rate ?? 0));
  const [discount, setDiscount] = useState<number>(Number(initial?.discount ?? 0));

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + (Number(i.quantity) || 0) * (Number(i.unit_price) || 0), 0),
    [items]
  );
  const afterDiscount = Math.max(subtotal - (Number(discount) || 0), 0);
  const taxAmount = (afterDiscount * (Number(taxRate) || 0)) / 100;
  const total = afterDiscount + taxAmount;

  function updateItem(idx: number, patch: Partial<ItemRow>) {
    setItems((prev) => prev.map((row, i) => (i === idx ? { ...row, ...patch } : row)));
  }
  function addItem() {
    setItems((prev) => [...prev, { description: "", quantity: 1, unit_price: 0 }]);
  }
  function removeItem(idx: number) {
    setItems((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== idx)));
  }

  function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await action(formData);
      if (result && result.ok === false) setError(result.error);
    });
  }

  if (clients.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        {t.invoices.needClient}{" "}
        <a href="/clients/new" className="font-medium text-brand-600 hover:text-brand-700">
          {t.clients.addClient}
        </a>
      </div>
    );
  }

  return (
    <form action={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Select
          label={t.nav.clients.replace(/s$/, "")}
          name="client_id"
          defaultValue={initial?.client_id ?? defaultClientId ?? clients[0].id}
          required
        >
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
              {c.company ? ` — ${c.company}` : ""}
            </option>
          ))}
        </Select>
        <Select label={t.common.status} name="status" defaultValue={initial?.status ?? "draft"}>
          <option value="draft">{t.status.draft}</option>
          <option value="sent">{t.status.sent}</option>
          <option value="paid">{t.status.paid}</option>
          <option value="overdue">{t.status.overdue}</option>
        </Select>
        <Select
          label={t.common.currency}
          name="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          {SUPPORTED_CURRENCIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        <Input
          label={t.common.issued}
          type="date"
          name="issue_date"
          defaultValue={initial?.issue_date ?? today()}
          required
        />
        <Input label={t.common.due} type="date" name="due_date" defaultValue={initial?.due_date ?? ""} />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">{t.invoices.lineItems}</h3>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            {t.common.addItem}
          </Button>
        </div>
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2 text-left font-medium">{t.common.description}</th>
                <th className="px-3 py-2 text-right font-medium w-24">{t.common.qty}</th>
                <th className="px-3 py-2 text-right font-medium w-32">{t.common.unitPrice}</th>
                <th className="px-3 py-2 text-right font-medium w-32">{t.common.total}</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {items.map((row, idx) => {
                const lineTotal = (Number(row.quantity) || 0) * (Number(row.unit_price) || 0);
                return (
                  <tr key={idx} className="border-t border-slate-100">
                    <td className="px-3 py-2">
                      <input
                        name="item_description"
                        value={row.description}
                        onChange={(e) => updateItem(idx, { description: e.target.value })}
                        placeholder={t.common.description}
                        className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                        required
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        name="item_quantity"
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={row.quantity}
                        onChange={(e) => updateItem(idx, { quantity: Number(e.target.value) })}
                        className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-right text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        name="item_unit_price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={row.unit_price}
                        onChange={(e) => updateItem(idx, { unit_price: Number(e.target.value) })}
                        className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-right text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                      />
                    </td>
                    <td className="px-3 py-2 text-right font-medium text-slate-800">
                      {formatCurrency(lineTotal, currency)}
                    </td>
                    <td className="px-2 py-2 text-right">
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-rose-600"
                        aria-label="Remove"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Textarea label={t.common.notes} name="notes" rows={4} defaultValue={initial?.notes ?? ""} />
        </div>
        <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <Row label={t.common.subtotal} value={formatCurrency(subtotal, currency)} />
          <div className="flex items-center justify-between gap-3">
            <label className="text-sm text-slate-600">{t.common.discount}</label>
            <input
              name="discount"
              type="number"
              step="0.01"
              min="0"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              className="w-28 rounded-md border border-slate-300 px-2 py-1 text-right text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <label className="text-sm text-slate-600">{t.common.tax} %</label>
            <input
              name="tax_rate"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={taxRate}
              onChange={(e) => setTaxRate(Number(e.target.value))}
              className="w-28 rounded-md border border-slate-300 px-2 py-1 text-right text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>
          <Row label={`${t.common.tax} (${Number(taxRate).toFixed(2)}%)`} value={formatCurrency(taxAmount, currency)} />
          <div className="border-t border-slate-200 pt-3">
            <Row label={t.common.total} value={formatCurrency(total, currency)} bold />
          </div>
        </div>
      </div>

      {error && <div className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}

      <input type="hidden" name="open_pdf" value={openPdfNext ? "1" : "0"} />

      <div className="flex flex-col items-stretch justify-end gap-2 sm:flex-row sm:items-center">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          {t.common.cancel}
        </Button>
        {showPdfCta && (
          <Button
            type="submit"
            variant="outline"
            loading={pending && openPdfNext}
            onClick={() => setOpenPdfNext(true)}
          >
            {t.invoices.createAndPdf}
          </Button>
        )}
        <Button
          type="submit"
          loading={pending && !openPdfNext}
          onClick={() => setOpenPdfNext(false)}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-3 text-sm ${bold ? "text-base" : ""}`}>
      <span className={bold ? "font-semibold text-slate-900" : "text-slate-600"}>{label}</span>
      <span className={bold ? "font-semibold text-slate-900" : "font-medium text-slate-800"}>{value}</span>
    </div>
  );
}
