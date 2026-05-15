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

  // Build a sensible default payment_terms from profile bank info
  const bankBits: string[] = [];
  if (profile?.bank_name) bankBits.push(profile.bank_name);
  if (profile?.bank_iban) bankBits.push(`IBAN: ${profile.bank_iban}`);
  if (profile?.bank_swift) bankBits.push(`SWIFT: ${profile.bank_swift}`);
  if (profile?.bank_account) bankBits.push(`Account: ${profile.bank_account}`);
  const defaultPaymentTerms = bankBits.length
    ? `Net 30. Pay by bank transfer to:\n${bankBits.join("\n")}`
    : "";

  return (
    <div className="space-y-6">
      <PageHeader title={t.invoices.newInvoice} description={t.invoices.formNewDesc} />
      <Card>
        <CardBody>
          <InvoiceForm
            clients={clients}
            defaultClientId={sp.client}
            defaultCurrency={profile?.default_currency ?? "USD"}
            defaultPaymentTerms={defaultPaymentTerms}
            action={createInvoiceAction}
            submitLabel={t.invoices.createBtn}
            showPdfCta
          />
        </CardBody>
      </Card>
    </div>
  );
}
