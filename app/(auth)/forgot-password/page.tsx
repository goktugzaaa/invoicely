import Link from "next/link";
import { ForgotForm } from "./ForgotForm";
import { getDict } from "@/lib/i18n/server";

export default async function ForgotPasswordPage() {
  const t = await getDict();
  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">{t.auth.forgotTitle}</h1>
      <p className="mt-1 text-sm text-slate-500">{t.auth.forgotSub}</p>
      <div className="mt-6">
        <ForgotForm />
      </div>
      <p className="mt-6 text-center text-sm">
        <Link href="/login" className="font-medium text-brand-600 hover:text-brand-700">
          ← {t.auth.backToLogin}
        </Link>
      </p>
    </div>
  );
}
