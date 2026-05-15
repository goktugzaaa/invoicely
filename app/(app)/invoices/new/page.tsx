import { requireUser } from "@/lib/auth";
import { getActiveClientsForSelect } from "@/services/invoices";
import { getProfile } from "@/services/profile";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { InvoiceForm } from "../InvoiceForm";
import { createInvoiceAction } from "../actions";
import { getDict } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function NewInvoicePage({
  searchParams,
}: {
  searchParams: Promise<{ client?: string }>;
}) {
  const sp = await searchParams;
  const { user } = await requireUser();
  const [clients, profile, t] = await Promise.all([
    getActiveClientsForSelect(user.id),
    getProfile(user.id),
    getDict(),
  ]);
  return (
    <div className="space-y-6">
      <PageHeader title={t.invoices.newInvoice} description={t.invoices.formNewDesc} />
      <Card>
        <CardBody>
          <InvoiceForm
            clients={clients}
            defaultClientId={sp.client}
            defaultCurrency={profile?.default_currency ?? "USD"}
            action={createInvoiceAction}
            submitLabel={t.invoices.createBtn}
            showPdfCta
          />
        </CardBody>
      </Card>
    </div>
  );
}
