import { requireUser } from "@/lib/auth";
import { getProfileWithLogoUrl } from "@/services/profile";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { SettingsForm } from "./SettingsForm";
import { LogoUploader } from "./LogoUploader";
import { getDict } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const { user } = await requireUser();
  const [result, t] = await Promise.all([getProfileWithLogoUrl(user.id), getDict()]);
  const profile = result?.profile ?? null;
  const logoUrl = result?.logoUrl ?? null;

  return (
    <div className="space-y-6">
      <PageHeader title={t.settings.title} description={t.settings.desc} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t.settings.profile}</CardTitle>
          </CardHeader>
          <CardBody>
            <SettingsForm initial={profile} />
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t.settings.logo}</CardTitle>
          </CardHeader>
          <CardBody>
            <LogoUploader logoUrl={logoUrl} hasLogo={!!profile?.logo_path} />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
