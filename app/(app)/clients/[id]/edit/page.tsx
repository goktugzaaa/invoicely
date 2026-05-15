import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getClient } from "@/services/clients";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { ClientForm } from "../../ClientForm";
import { updateClientAction } from "../../actions";
import { getDict } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { user } = await requireUser();
  const [client, t] = await Promise.all([getClient(user.id, id), getDict()]);
  if (!client) notFound();

  const action = updateClientAction.bind(null, client.id);

  return (
    <div className="space-y-6">
      <PageHeader title={`${t.common.edit} — ${client.name}`} description={t.clients.formEditDesc} />
      <Card>
        <CardBody>
          <ClientForm initial={client} action={action} submitLabel={t.common.saveChanges} />
        </CardBody>
      </Card>
    </div>
  );
}
