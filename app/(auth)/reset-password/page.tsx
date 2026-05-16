import Link from "next/link";
import { ResetForm } from "./ResetForm";
import { getDict } from "@/lib/i18n/server";

export default async function ResetPasswordPage() {
  const t = await getDict();
  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">{t.auth.resetTitle}</h1>
      <p className="mt-1 text-sm text-slate-500">{t.auth.resetSub}</p>
      <div className="mt-6">
        <ResetForm />
      </div>
      <p className="mt-6 text-center text-sm">
        <Link href="/login" className="font-medium text-brand-600 hover:text-brand-700">
          ← {t.auth.backToLogin}
        </Link>
      </p>
    </div>
  );
}
