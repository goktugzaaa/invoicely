import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { listClients, getClientKpis } from "@/services/clients";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Table, THead, TR, TH, TD } from "@/components/ui/Table";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterBar } from "@/components/ui/FilterBar";
import { Pagination } from "@/components/ui/Pagination";
import { ClientKpiStrip } from "@/components/clients/ClientKpiStrip";
import { formatDate } from "@/lib/utils";
import { getDict } from "@/lib/i18n/server";
import type { ClientStatus } from "@/types/db";

export const dynamic = "force-dynamic";

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const { user } = await requireUser();
  const [t, kpis] = await Promise.all([getDict(), getClientKpis(user.id)]);
  const status = (sp.status as ClientStatus | "all" | undefined) ?? "all";
  const page = Number(sp.page ?? 1);

  const { clients, total, pageSize } = await listClients(user.id, {
    q: sp.q,
    status,
    page,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t.landing.eyebrowPeople}
        title={t.clients.title}
        description={t.clients.desc}
        actions={
          <Link href="/clients/new">
            <Button>{t.clients.newClient}</Button>
          </Link>
        }
      />

      {/* KPI strip */}
      <ClientKpiStrip kpis={kpis} />

      <FilterBar
        searchPlaceholder={t.clients.searchPh}
        statusOptions={[
          { value: "all", label: t.status.all },
          { value: "active", label: t.status.active },
          { value: "inactive", label: t.status.inactive },
        ]}
      />

      {clients.length === 0 ? (
        <EmptyState
          variant="clients"
          title={t.clients.noneFound}
          description={sp.q || status !== "all" ? t.clients.cleanFilters : t.clients.addFirst}
          action={
            <Link href="/clients/new">
              <Button>{t.clients.addClient}</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          <Table className="border-0">
            <THead>
              <tr>
                <TH>{t.common.name}</TH>
                <TH>{t.common.company}</TH>
                <TH>{t.common.email}</TH>
                <TH>{t.common.status}</TH>
                <TH>{t.clients.added}</TH>
                <TH></TH>
              </tr>
            </THead>
            <tbody>
              {clients.map((c) => (
                <TR key={c.id}>
                  <TD className="font-medium text-slate-900 dark:text-slate-100">
                    <Link href={`/clients/${c.id}`} className="hover:text-brand-700 dark:hover:text-brand-400">
                      {c.name}
                    </Link>
                  </TD>
                  <TD>{c.company || "—"}</TD>
                  <TD>{c.email || "—"}</TD>
                  <TD>
                    <Badge value={c.status} label={t.status[c.status]} />
                  </TD>
                  <TD>{formatDate(c.created_at)}</TD>
                  <TD className="text-right">
                    <Link
                      href={`/clients/${c.id}/edit`}
                      className="font-mono text-[11px] uppercase tracking-widest text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                    >
                      {t.common.edit} →
                    </Link>
                  </TD>
                </TR>
              ))}
            </tbody>
          </Table>
          <Pagination
            page={page}
            pageSize={pageSize}
            total={total}
            basePath="/clients"
            query={{ q: sp.q, status: sp.status }}
          />
        </div>
      )}
    </div>
  );
}
