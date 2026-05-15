import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getInvoice } from "@/services/invoices";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { InvoiceActions } from "./InvoiceActions";
import { AutoPdf } from "./AutoPdf";
import { getDict } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { user } = await requireUser();
  const t = await getDict();
  const inv = await getInvoice(user.id, id);
  if (!inv) notFound();
  const ccy = inv.currency || "USD";
  const subtotal = Number(inv.subtotal ?? 0);
  const discount = Number(inv.discount ?? 0);
  const taxRate = Number(inv.tax_rate ?? 0);
  const taxAmount = Math.max(subtotal - discount, 0) * (taxRate / 100);

  return (
    <div className="space-y-6">
      <AutoPdf id={inv.id} />
      <PageHeader
        title={inv.invoice_number}
        description={inv.client?.name ?? t.invoices.title}
        actions={
          <div className="flex items-center gap-2">
            <a href={`/api/invoices/${inv.id}/pdf`} target="_blank" rel="noreferrer">
              <Button variant="outline">{t.invoices.downloadPdf}</Button>
            </a>
            <Link href={`/invoices/${inv.id}/edit`}>
              <Button>{t.common.edit}</Button>
            </Link>
            <InvoiceActions id={inv.id} status={inv.status} />
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>{t.invoices.summary}</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3 text-sm">
            <Detail label={t.common.status}>
              <Badge value={inv.status} label={t.status[inv.status]} />
            </Detail>
            <Detail label={t.common.currency}>{ccy}</Detail>
            <Detail label={t.common.issued}>{formatDate(inv.issue_date)}</Detail>
            <Detail label={t.common.due}>{formatDate(inv.due_date)}</Detail>
            <Detail label={t.common.total}>
              <span className="text-base font-semibold text-slate-900">
                {formatCurrency(inv.total_amount, ccy)}
              </span>
            </Detail>
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{t.invoices.billTo}</div>
              <div className="mt-1 text-slate-800">{inv.client?.name ?? "—"}</div>
              {inv.client?.company && <div className="text-slate-600">{inv.client.company}</div>}
              {inv.client?.email && <div className="text-slate-500">{inv.client.email}</div>}
            </div>
            {inv.notes && (
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{t.common.notes}</div>
                <p className="mt-1 whitespace-pre-line text-slate-700">{inv.notes}</p>
              </div>
            )}
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t.invoices.lineItems}</CardTitle>
          </CardHeader>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">{t.common.description}</th>
                    <th className="px-4 py-3 text-right font-medium">{t.common.qty}</th>
                    <th className="px-4 py-3 text-right font-medium">{t.common.unitPrice}</th>
                    <th className="px-4 py-3 text-right font-medium">{t.common.total}</th>
                  </tr>
                </thead>
                <tbody>
                  {inv.items.map((it) => (
                    <tr key={it.id} className="border-t border-slate-100">
                      <td className="px-4 py-3 text-slate-800">{it.description}</td>
                      <td className="px-4 py-3 text-right">{Number(it.quantity)}</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(it.unit_price, ccy)}</td>
                      <td className="px-4 py-3 text-right font-medium">
                        {formatCurrency(it.total_price, ccy)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50">
                  <tr className="border-t border-slate-200">
                    <td colSpan={3} className="px-4 py-2 text-right text-sm text-slate-600">
                      {t.common.subtotal}
                    </td>
                    <td className="px-4 py-2 text-right text-sm font-medium text-slate-800">
                      {formatCurrency(subtotal, ccy)}
                    </td>
                  </tr>
                  {discount > 0 && (
                    <tr>
                      <td colSpan={3} className="px-4 py-2 text-right text-sm text-slate-600">
                        {t.common.discount}
                      </td>
                      <td className="px-4 py-2 text-right text-sm font-medium text-slate-800">
                        −{formatCurrency(discount, ccy)}
                      </td>
                    </tr>
                  )}
                  {taxRate > 0 && (
                    <tr>
                      <td colSpan={3} className="px-4 py-2 text-right text-sm text-slate-600">
                        {t.common.tax} ({taxRate}%)
                      </td>
                      <td className="px-4 py-2 text-right text-sm font-medium text-slate-800">
                        {formatCurrency(taxAmount, ccy)}
                      </td>
                    </tr>
                  )}
                  <tr className="border-t border-slate-200">
                    <td colSpan={3} className="px-4 py-3 text-right text-sm font-semibold text-slate-700">
                      {t.common.total}
                    </td>
                    <td className="px-4 py-3 text-right text-base font-semibold text-slate-900">
                      {formatCurrency(inv.total_amount, ccy)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</span>
      <span className="text-right text-slate-700">{children}</span>
    </div>
  );
}
