import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { ClientForm } from "../ClientForm";
import { createClientAction } from "../actions";
import { getDict } from "@/lib/i18n/server";

export default async function NewClientPage() {
  const t = await getDict();
  return (
    <div className="space-y-6">
      <PageHeader title={t.clients.formNewTitle} description={t.clients.formNewDesc} />
      <Card>
        <CardBody>
          <ClientForm action={createClientAction} submitLabel={t.clients.createBtn} />
        </CardBody>
      </Card>
    </div>
  );
}
