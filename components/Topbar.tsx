"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Brand } from "@/components/Logo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useT } from "@/lib/i18n/context";

export function Topbar({ email }: { email: string }) {
  const router = useRouter();
  const t = useT();
  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="md:hidden">
        <Brand size="sm" href="/dashboard" />
      </div>
      <div className="ml-auto flex items-center gap-3">
        <LanguageSwitcher />
        <span className="hidden text-sm text-slate-600 sm:inline">{email}</span>
        <Button variant="outline" size="sm" onClick={signOut}>
          {t.nav.signOut}
        </Button>
      </div>
    </header>
  );
}
