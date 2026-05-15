import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { listInvoices } from "@/services/invoices";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Table, THead, TR, TH, TD } from "@/components/ui/Table";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterBar } from "@/components/ui/FilterBar";
import { Pagination } from "@/components/ui/Pagination";
import { formatCurrency, formatDate, isOverdue } from "@/lib/utils";
import { getDict } from "@/lib/i18n/server";
import type { InvoiceStatus } from "@/types/db";

export const dynamic = "force-dynamic";

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const { user } = await requireUser();
  const t = await getDict();
  const status = (sp.status as InvoiceStatus | "all" | undefined) ?? "all";
  const page = Number(sp.page ?? 1);

  const { invoices, total, pageSize } = await listInvoices(user.id, {
    q: sp.q,
    status,
    page,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.invoices.title}
        description={t.invoices.desc}
        actions={
          <Link href="/invoices/new">
            <Button>{t.invoices.newInvoice}</Button>
          </Link>
        }
      />

      <FilterBar
        searchPlaceholder={t.invoices.searchPh}
        statusOptions={[
          { value: "all", label: t.status.all },
          { value: "draft", label: t.status.draft },
          { value: "sent", label: t.status.sent },
          { value: "paid", label: t.status.paid },
          { value: "overdue", label: t.status.overdue },
        ]}
      />

      {invoices.length === 0 ? (
        <EmptyState
          variant="invoices"
          title={t.invoices.noneFound}
          description={sp.q || status !== "all" ? t.invoices.cleanFilters : t.invoices.createFirst}
          action={
            <Link href="/invoices/new">
              <Button>{t.invoices.createBtn}</Button>
            </Link>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <Table className="border-0">
            <THead>
              <tr>
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
                return (
                  <TR key={inv.id}>
                    <TD className="font-medium text-slate-900">
                      <Link href={`/invoices/${inv.id}`} className="hover:text-brand-700">
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
          <Pagination
            page={page}
            pageSize={pageSize}
            total={total}
            basePath="/invoices"
            query={{ q: sp.q, status: sp.status }}
          />
        </div>
      )}
    </div>
  );
}
