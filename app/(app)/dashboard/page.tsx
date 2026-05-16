import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getDashboardStats, type DashboardRange } from "@/services/dashboard";
import { getProfile } from "@/services/profile";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Table, THead, TR, TH, TD } from "@/components/ui/Table";
import { EmptyState } from "@/components/ui/EmptyState";
import { RevenueBar, StatusList } from "@/components/dashboard/Charts";
import { RangeToggle } from "@/components/dashboard/RangeToggle";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { Onboarding } from "@/components/dashboard/Onboarding";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getDict } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

const VALID_RANGES: DashboardRange[] = ["7d", "30d", "90d", "12m"];

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
  const [stats, profile, t] = await Promise.all([
    getDashboardStats(user.id, range),
    getProfile(user.id),
    getDict(),
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

  const cards = [
    {
      label: t.dashboard.totalRevenue,
      value: formatCurrency(stats.rangeRevenue, ccy),
      hint: t.dashboard.totalRevenueHint(rangeLabel),
    },
    {
      label: t.dashboard.outstanding,
      value: formatCurrency(stats.unpaidAmount, ccy),
      hint: t.dashboard.outstandingHint(stats.unpaidCount),
    },
    {
      label: t.dashboard.activeClients,
      value: stats.activeClients.toString(),
      hint: t.dashboard.activeClientsHint,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between">
        <span aria-hidden className="absolute inset-y-0 left-0 w-1.5 bg-brand-gradient" />
        <span aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-brand-gradient-soft blur-2xl" />
        <div className="relative">
          <p className="mb-1 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-brand-600">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
            Paidly
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            {t.dashboard.welcome(displayName)}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{t.dashboard.welcomeSub}</p>
        </div>
        <div className="relative flex items-center gap-2">
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

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardBody>
              <div className="text-sm font-medium text-slate-500">{c.label}</div>
              <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{c.value}</div>
              <div className="mt-1 text-xs text-slate-500">{c.hint}</div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          {t.dashboard.quickActions}
        </h2>
        <QuickActions />
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

      {/* Recent invoices + activity feed */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>{t.dashboard.recent}</CardTitle>
            <Link href="/invoices" className="text-sm font-medium text-brand-600 hover:text-brand-700">
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
                    <TH>{t.common.issued}</TH>
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
                      <TD>{formatDate(inv.issue_date)}</TD>
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

        <Card>
          <CardHeader>
            <CardTitle>{t.dashboard.activity}</CardTitle>
          </CardHeader>
          <CardBody className="p-0">
            <ActivityFeed items={stats.activity} />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
