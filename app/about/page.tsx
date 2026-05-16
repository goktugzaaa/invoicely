import Link from "next/link";
import Image from "next/image";
import { Brand } from "@/components/Logo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { getDict } from "@/lib/i18n/server";

export const metadata = {
  title: "About",
  description: "About the person who built Nib.",
};

export default async function AboutPage() {
  const t = await getDict();
  return (
    <main className="min-h-screen bg-[#f8f7f4] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-900/10 bg-[#f8f7f4]/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Brand size="md" href="/" />
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link href="/login" className="hidden text-xs font-medium uppercase tracking-widest text-slate-700 hover:text-slate-900 sm:inline-block">
              {t.landing.signIn}
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-20 sm:py-32">
        <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-slate-500">
          — About
        </p>
        <h1 className="mt-4 text-5xl font-semibold leading-[1.05] tracking-[-0.025em] sm:text-6xl">
          One person.
          <span className="block font-serif italic text-slate-500">One weekend.</span>
          One pissed-off invoice.
        </h1>

        <div className="mt-10 flex items-center gap-5">
          <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full ring-2 ring-slate-200">
            <Image
              src="/me.jpeg"
              alt="Göktuğ Zaimoğlu"
              fill
              sizes="80px"
              className="object-cover"
              priority
            />
          </span>
          <div>
            <p className="text-lg font-semibold">Göktuğ Zaimoğlu</p>
            <p className="text-sm text-slate-600">Freelance developer · Istanbul</p>
          </div>
        </div>

        <div className="prose prose-slate mt-10 max-w-none space-y-6 text-base leading-relaxed text-slate-700">
          <p>
            I freelance. I built Nib because the thing I was using kept asking me to upgrade
            to see the &ldquo;overdue&rdquo; filter — while I was, in fact, owed $4k from a client
            who&apos;d gone quiet for 47 days.
          </p>
          <p>
            I&apos;m not trying to replace QuickBooks. I&apos;m not building an accounting platform.
            I wanted a tool that opens fast, kicks out a clean PDF, and tells me who owes me money
            without me having to think about it.
          </p>
          <p className="font-serif text-xl italic text-slate-600">
            If you&apos;re a freelancer or a 2-person studio, this is for you. If you&apos;re a
            12-person finance team — it isn&apos;t. And that&apos;s on purpose.
          </p>
          <p>
            Nib is open source (MIT). The code lives on GitHub. The whole thing was built in a
            couple of weeks of evenings. I&apos;m shipping in public — what&apos;s broken, what&apos;s
            next, what I&apos;ve decided to never do.
          </p>
          <p>
            Want to talk? DM me on X. Found a bug? Open a GitHub issue. Want to fork this and
            rebrand it for your own freelance niche? Go ahead — that&apos;s why it&apos;s MIT.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap gap-3 font-mono text-[11px] uppercase tracking-widest">
          <a
            href="https://github.com/goktugzaaa/paidly"
            target="_blank"
            rel="noreferrer"
            className="border-b border-slate-900 pb-0.5 text-slate-900 hover:opacity-70"
          >
            GitHub →
          </a>
          <a
            href="https://twitter.com/goktugzaaa"
            target="_blank"
            rel="noreferrer"
            className="border-b border-slate-900 pb-0.5 text-slate-900 hover:opacity-70"
          >
            Twitter / X →
          </a>
          <Link href="/changelog" className="border-b border-slate-900 pb-0.5 text-slate-900 hover:opacity-70">
            Changelog →
          </Link>
          <Link href="/" className="border-b border-slate-300 pb-0.5 text-slate-600 hover:text-slate-900">
            ← Back home
          </Link>
        </div>
      </section>
    </main>
  );
}
