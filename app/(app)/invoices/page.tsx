import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { listInvoices, type InvoicePeriod } from "@/services/invoices";
import { getProfile } from "@/services/profile";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterBar } from "@/components/ui/FilterBar";
import { Pagination } from "@/components/ui/Pagination";
import { PeriodToggle, type Period } from "@/components/ui/PeriodToggle";
import { getDict } from "@/lib/i18n/server";
import { InvoiceTable } from "./InvoiceTable";
import { StatusKpiStrip } from "@/components/invoices/StatusKpiStrip";
import { InvoiceGrid } from "@/components/invoices/InvoiceGrid";
import { ViewToggle, type ViewMode } from "@/components/invoices/ViewToggle";
import type { InvoiceStatus } from "@/types/db";

export const dynamic = "force-dynamic";

const VALID_PERIODS: InvoicePeriod[] = ["week", "month", "quarter", "year", "all"];
const VALID_VIEWS: ViewMode[] = ["grid", "table"];

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    status?: string;
    page?: string;
    period?: string;
    view?: string;
  }>;
}) {
  const sp = await searchParams;
  const { user } = await requireUser();
  const [t, profile] = await Promise.all([getDict(), getProfile(user.id)]);
  const status = (sp.status as InvoiceStatus | "all" | undefined) ?? "all";
  const page = Number(sp.page ?? 1);
  const period: InvoicePeriod = (VALID_PERIODS.includes(sp.period as InvoicePeriod)
    ? sp.period
    : "all") as InvoicePeriod;
  const view: ViewMode = (VALID_VIEWS.includes(sp.view as ViewMode) ? sp.view : "table") as ViewMode;

  const { invoices, total, pageSize, summary } = await listInvoices(user.id, {
    q: sp.q,
    status,
    period,
    page,
  });

  const ccy = summary.currency || profile?.default_currency || "USD";

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t.landing.eyebrowBilling}
        title={t.invoices.title}
        description={`${summary.count} ${t.invoices.title.toLowerCase()}`}
        actions={
          <Link href="/invoices/new">
            <Button>{t.invoices.newInvoice}</Button>
          </Link>
        }
      />

      {/* Status KPI strip — Draft / Unpaid / Overdue / Paid */}
      <StatusKpiStrip byStatus={summary.byStatus} currency={ccy} />

      {/* Period + View toggles */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PeriodToggle value={period as Period} />
        <ViewToggle value={view} />
      </div>

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
          description={sp.q || status !== "all" || period !== "all" ? t.invoices.cleanFilters : t.invoices.createFirst}
          action={
            <Link href="/invoices/new">
              <Button>{t.invoices.createBtn}</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {view === "grid" ? <InvoiceGrid invoices={invoices} /> : <InvoiceTable invoices={invoices} />}
          <Pagination
            page={page}
            pageSize={pageSize}
            total={total}
            basePath="/invoices"
            query={{ q: sp.q, status: sp.status, period: sp.period, view: sp.view }}
          />
        </div>
      )}
    </div>
  );
}
