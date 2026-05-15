import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "./LoginForm";
import { getDict } from "@/lib/i18n/server";

export default async function LoginPage() {
  const t = await getDict();
  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">{t.auth.welcomeBack}</h1>
      <p className="mt-1 text-sm text-slate-500">{t.auth.signInSub}</p>
      <div className="mt-6">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
      <p className="mt-6 text-center text-sm text-slate-600">
        {t.auth.noAccount}{" "}
        <Link href="/signup" className="font-medium text-brand-600 hover:text-brand-700">
          {t.auth.signUp}
        </Link>
      </p>
    </div>
  );
}
