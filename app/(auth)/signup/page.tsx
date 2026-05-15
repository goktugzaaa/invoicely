import Link from "next/link";
import { SignupForm } from "./SignupForm";
import { getDict } from "@/lib/i18n/server";

export default async function SignupPage() {
  const t = await getDict();
  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">{t.auth.createAccount}</h1>
      <p className="mt-1 text-sm text-slate-500">{t.auth.signUpSub}</p>
      <div className="mt-6">
        <SignupForm />
      </div>
      <p className="mt-6 text-center text-sm text-slate-600">
        {t.auth.haveAccount}{" "}
        <Link href="/login" className="font-medium text-brand-600 hover:text-brand-700">
          {t.auth.signInBtn}
        </Link>
      </p>
    </div>
  );
}
