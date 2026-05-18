import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getDashboardStats, type DashboardRange } from "@/services/dashboard";
import { getProfile } from "@/services/profile";
import { getTopClients } from "@/services/reports";
import { getActionItems, getRevenueDelta } from "@/services/actions";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Table, THead, TR, TH, TD } from "@/components/ui/Table";
import { EmptyState } from "@/components/ui/EmptyState";
import { RevenueBar, StatusList } from "@/components/dashboard/Charts";
import { RangeToggle } from "@/components/dashboard/RangeToggle";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { Onboarding } from "@/components/dashboard/Onboarding";
import { TopClients } from "@/components/dashboard/TopClients";
import { ActionItems } from "@/components/dashboard/ActionItems";
import { StatusKpiStrip } from "@/components/invoices/StatusKpiStrip";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { getDict } from "@/lib/i18n/server";
import type { InvoiceStatus } from "@/types/db";
import type { StatusBucket } from "@/services/invoices";

export const dynamic = "force-dynamic";

const VALID_RANGES: DashboardRange[] = ["7d", "30d", "90d", "12m"];
const RANGE_DAYS: Record<DashboardRange, number> = { "7d": 7, "30d": 30, "90d": 90, "12m": 365, all: 365 };

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const sp = await searchParams;
  const range: DashboardRange = (VALID_RANGES.includes(sp.range as DashboardRange)
    ? sp.range
    : "30d") as DashboardRange;

  const { user } = await requireUser();
  const [stats, profile, t, topClients, actionItems, delta] = await Promise.all([
    getDashboardStats(user.id, range),
    getProfile(user.id),
    getDict(),
    getTopClients(user.id, 5),
    getActionItems(user.id),
    getRevenueDelta(user.id, RANGE_DAYS[range]),
  ]);
  const ccy = profile?.default_currency ?? "USD";
  const displayName =
    profile?.business_name ||
    user.user_metadata?.full_name ||
    (user.email ? user.email.split("@")[0] : "there");

  const rangeLabel = {
    "7d": t.dashboard.rangeLabel7d,
    "30d": t.dashboard.rangeLabel30d,
    "90d": t.dashboard.rangeLabel90d,
    "12m": t.dashboard.rangeLabel12m,
    all: "",
  }[range];

  // Reshape stats.statuses (array) → Record<InvoiceStatus, StatusBucket> for StatusKpiStrip
  const byStatus: Record<InvoiceStatus, StatusBucket> = {
    draft: { count: 0, amount: 0 },
    sent: { count: 0, amount: 0 },
    paid: { count: 0, amount: 0 },
    overdue: { count: 0, amount: 0 },
  };
  for (const s of stats.statuses) {
    byStatus[s.status] = { count: s.count, amount: s.amount };
  }

  return (
    <div className="space-y-8">
      {/* Greeting — minimal */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
            — {t.dashboard.title}
          </p>
          <h1 className="text-3xl font-semibold tracking-[-0.025em] text-slate-900 sm:text-4xl dark:text-slate-100">
            {t.dashboard.welcomePrefix}{" "}
            <span className="font-serif italic text-slate-500 dark:text-slate-400">{displayName}</span>
            {t.dashboard.welcomeSuffix}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <RangeToggle value={range} />
          <Link href="/invoices/new">
            <Button>{t.dashboard.newInvoice}</Button>
          </Link>
        </div>
      </div>

      {/* Onboarding (if first-time) */}
      {stats.hasOnboardingNeeded && (
        <Onboarding
          hasProfile={!!profile?.business_name}
          hasClient={stats.activeClients > 0}
          hasInvoice={stats.recent.length > 0}
        />
      )}

      {/* Status KPI strip — 4 status cards (Draft / Unpaid / Overdue / Paid) */}
      <StatusKpiStrip byStatus={byStatus} currency={ccy} />

      {/* Flat secondary stats — small text row, no balloons */}
      <div className="flex flex-wrap items-baseline gap-x-8 gap-y-3 border-y border-slate-200 py-4 text-sm dark:border-white/10">
        <StatLine
          label={t.dashboard.totalRevenue}
          value={formatCurrency(stats.rangeRevenue, ccy)}
          hint={rangeLabel}
          delta={delta}
        />
        <StatLine
          label={t.dashboard.outstanding}
          value={formatCurrency(stats.unpaidAmount, ccy)}
          hint={`${stats.unpaidCount}`}
        />
        <StatLine
          label={t.dashboard.activeClients}
          value={stats.activeClients.toString()}
          hint={t.dashboard.activeClientsHint}
        />
      </div>

      {/* Needs attention + Activity (priority row) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>{t.actions.title}</CardTitle>
              <p className="mt-0.5 text-xs text-slate-500">{t.actions.sub}</p>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <ActionItems items={actionItems} />
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t.dashboard.activity}</CardTitle>
          </CardHeader>
          <CardBody className="p-0">
            <ActivityFeed items={stats.activity} />
          </CardBody>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>{t.dashboard.revenueChart}</CardTitle>
              <p className="mt-0.5 text-xs text-slate-500">{t.dashboard.revenueChartSub}</p>
            </div>
          </CardHeader>
          <CardBody>
            <RevenueBar data={stats.monthly} currency={ccy} />
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t.dashboard.statusMix}</CardTitle>
          </CardHeader>
          <CardBody>
            <StatusList data={stats.statuses} currency={ccy} />
          </CardBody>
        </Card>
      </div>

      {/* Top clients + Recent invoices */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle>{t.topClients.title}</CardTitle>
              <p className="mt-0.5 text-xs text-slate-500">{t.topClients.sub}</p>
            </div>
            <Link href="/reports" className="font-mono text-[11px] uppercase tracking-widest text-slate-500 hover:text-slate-900">
              {t.dashboard.viewAll}
            </Link>
          </CardHeader>
          <CardBody className="p-0">
            <TopClients clients={topClients} />
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>{t.dashboard.recent}</CardTitle>
            <Link href="/invoices" className="font-mono text-[11px] uppercase tracking-widest text-slate-500 hover:text-slate-900">
              {t.dashboard.viewAll}
            </Link>
          </CardHeader>
          <CardBody className="p-0">
            {stats.recent.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  variant="invoices"
                  title={t.dashboard.noInvoices}
                  description={t.dashboard.noInvoicesDesc}
                  action={
                    <Link href="/invoices/new">
                      <Button>{t.dashboard.createInvoice}</Button>
                    </Link>
                  }
                />
              </div>
            ) : (
              <Table className="border-0">
                <THead>
                  <tr>
                    <TH>{t.invoices.title}</TH>
                    <TH>{t.nav.clients}</TH>
                    <TH>{t.common.status}</TH>
                    <TH className="text-right">{t.common.amount}</TH>
                  </tr>
                </THead>
                <tbody>
                  {stats.recent.map((inv) => (
                    <TR key={inv.id}>
                      <TD className="font-medium text-slate-900">
                        <Link href={`/invoices/${inv.id}`} className="hover:text-brand-700">
                          {inv.invoice_number}
                        </Link>
                      </TD>
                      <TD>{inv.client?.name ?? "—"}</TD>
                      <TD>
                        <Badge value={inv.status} label={t.status[inv.status]} />
                      </TD>
                      <TD className="text-right font-medium">
                        {formatCurrency(inv.total_amount, inv.currency || ccy)}
                      </TD>
                    </TR>
                  ))}
                </tbody>
              </Table>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function StatLine({
  label,
  value,
  hint,
  delta,
}: {
  label: string;
  value: string;
  hint?: string;
  delta?: number | null;
}) {
  const positive = delta !== undefined && delta !== null && delta >= 0;
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-xl font-semibold tabular-nums text-slate-900 dark:text-slate-100">
          {value}
        </span>
        {delta !== undefined && delta !== null && (
          <span
            className={cn(
              "text-xs font-medium",
              positive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
            )}
          >
            {positive ? "▲" : "▼"} {Math.abs(delta).toFixed(0)}%
          </span>
        )}
        {hint && <span className="text-xs text-slate-500 dark:text-slate-400">· {hint}</span>}
      </div>
    </div>
  );
}
