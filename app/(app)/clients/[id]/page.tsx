import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getClient, getClientInvoices } from "@/services/clients";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Table, THead, TR, TH, TD } from "@/components/ui/Table";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency, formatDate } from "@/lib/utils";
import { DeleteClientButton } from "./DeleteClientButton";
import { getDict } from "@/lib/i18n/server";
import { getCountry } from "@/lib/countries";
import type { Invoice } from "@/types/db";

export const dynamic = "force-dynamic";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { user } = await requireUser();
  const t = await getDict();
  const client = await getClient(user.id, id);
  if (!client) notFound();
  const invoices = (await getClientInvoices(user.id, client.id)) as Invoice[];

  return (
    <div className="space-y-6">
      <PageHeader
        title={client.name}
        description={client.company || t.clients.title}
        actions={
          <div className="flex items-center gap-2">
            <Link href={`/invoices/new?client=${client.id}`}>
              <Button variant="outline">{t.invoices.newInvoice}</Button>
            </Link>
            <Link href={`/clients/${client.id}/edit`}>
              <Button>{t.common.edit}</Button>
            </Link>
            <DeleteClientButton id={client.id} />
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
              <Badge value={client.status} label={t.status[client.status]} />
            </Detail>
            <Detail label={t.common.email}>{client.email || "—"}</Detail>
            <Detail label={t.common.phone}>{client.phone || "—"}</Detail>
            <Detail label={t.common.company}>{client.company || "—"}</Detail>
            {(() => {
              const c = getCountry(client.country);
              return c ? (
                <Detail label={t.fields.country}>
                  <span>{c.flag} {c.name}</span>
                </Detail>
              ) : null;
            })()}
            {client.vat_id && (
              <Detail label={t.fields.vatId}>
                <span className="font-mono text-xs">{client.vat_id}</span>
              </Detail>
            )}
            {client.address && (
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{t.fields.address}</div>
                <p className="mt-1 whitespace-pre-line text-slate-700">{client.address}</p>
              </div>
            )}
            <Detail label={t.clients.added}>{formatDate(client.created_at)}</Detail>
            {client.notes && (
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{t.common.notes}</div>
                <p className="mt-1 whitespace-pre-line text-slate-700">{client.notes}</p>
              </div>
            )}
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t.invoices.title}</CardTitle>
          </CardHeader>
          <CardBody className="p-0">
            {invoices.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  variant="invoices"
                  title={t.clients.invoicesEmpty}
                  action={
                    <Link href={`/invoices/new?client=${client.id}`}>
                      <Button>{t.invoices.createBtn}</Button>
                    </Link>
                  }
                />
              </div>
            ) : (
              <Table>
                <THead>
                  <tr>
                    <TH>{t.invoices.title}</TH>
                    <TH>{t.common.issued}</TH>
                    <TH>{t.common.due}</TH>
                    <TH>{t.common.status}</TH>
                    <TH className="text-right">{t.common.amount}</TH>
                  </tr>
                </THead>
                <tbody>
                  {invoices.map((inv) => (
                    <TR key={inv.id}>
                      <TD className="font-medium text-slate-900">
                        <Link href={`/invoices/${inv.id}`} className="hover:text-brand-700">
                          {inv.invoice_number}
                        </Link>
                      </TD>
                      <TD>{formatDate(inv.issue_date)}</TD>
                      <TD>{formatDate(inv.due_date)}</TD>
                      <TD>
                        <Badge value={inv.status} label={t.status[inv.status]} />
                      </TD>
                      <TD className="text-right font-medium">
                        {formatCurrency(inv.total_amount, inv.currency || "USD")}
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

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</span>
      <span className="text-right text-slate-700">{children}</span>
    </div>
  );
}
