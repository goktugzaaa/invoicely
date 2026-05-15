import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getInvoice, getActiveClientsForSelect } from "@/services/invoices";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { InvoiceForm } from "../../InvoiceForm";
import { updateInvoiceAction } from "../../actions";
import { getDict } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function EditInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { user } = await requireUser();
  const [invoice, clients, t] = await Promise.all([
    getInvoice(user.id, id),
    getActiveClientsForSelect(user.id),
    getDict(),
  ]);
  if (!invoice) notFound();

  const action = updateInvoiceAction.bind(null, invoice.id);

  return (
    <div className="space-y-6">
      <PageHeader title={`${t.common.edit} ${invoice.invoice_number}`} description={t.invoices.formEditDesc} />
      <Card>
        <CardBody>
          <InvoiceForm
            clients={clients}
            initial={invoice}
            action={action}
            submitLabel={t.common.saveChanges}
          />
        </CardBody>
      </Card>
    </div>
  );
}
