"use client";

import { Brand } from "@/components/Logo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ProfileMenu } from "@/components/ProfileMenu";
import { CommandPaletteTrigger } from "@/components/CommandPalette";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Topbar({ email, businessName }: { email: string; businessName?: string | null }) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.02]">
      <div className="md:hidden">
        <Brand size="sm" href="/dashboard" />
      </div>
      <div className="ml-auto flex items-center gap-3">
        <CommandPaletteTrigger />
        <ThemeToggle />
        <LanguageSwitcher />
        <ProfileMenu email={email} businessName={businessName} />
      </div>
    </header>
  );
}
