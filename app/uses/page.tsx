import Link from "next/link";
import { Brand } from "@/components/Logo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { getDict } from "@/lib/i18n/server";

export const metadata = {
  title: "Uses",
  description: "Tools, gear and stack behind Paidly.",
};

interface Group {
  label: string;
  items: { name: string; note: string }[];
}

const STACK: Group[] = [
  {
    label: "How Paidly is built",
    items: [
      { name: "Next.js 15", note: "App Router, server actions, server components." },
      { name: "Supabase", note: "Postgres, Auth, Storage, RLS — multi-tenant out of the box." },
      { name: "Tailwind CSS", note: "Hand-rolled design system. No shadcn." },
      { name: "TypeScript", note: "Strict mode. Server + client share Zod schemas." },
      { name: "pdf-lib + Inter TTF", note: "Server-rendered PDFs with full Unicode (TR İ/ğ/ç/ş)." },
      { name: "Recharts", note: "Lightweight, customizable charts." },
      { name: "Vercel", note: "Deploy on push from main." },
    ],
  },
  {
    label: "Editor & daily",
    items: [
      { name: "Cursor", note: "Most of the wiring." },
      { name: "Figma", note: "Mockups before code." },
      { name: "Linear", note: "Tasks." },
      { name: "Loom", note: "Quick demos." },
      { name: "Raycast", note: "Window management + clipboard history." },
    ],
  },
  {
    label: "Money / freelance ops",
    items: [
      { name: "Wise", note: "Multi-currency receiving." },
      { name: "Notion", note: "Docs + meeting notes." },
      { name: "Paidly", note: "(Yes, really. Eating my own.)" },
    ],
  },
];

export default async function UsesPage() {
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

      <section className="mx-auto max-w-3xl px-6 py-20 sm:py-28">
        <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-slate-500">
          — Uses
        </p>
        <h1 className="mt-4 text-5xl font-semibold leading-[1.05] tracking-[-0.025em] sm:text-6xl">
          Stack,
          <span className="block font-serif italic text-slate-500">tools,</span>
          things I&apos;d recommend.
        </h1>
        <p className="mt-6 max-w-xl text-slate-600">
          A short list. Updated whenever I switch something. Inspired by{" "}
          <a href="https://uses.tech" target="_blank" rel="noreferrer" className="border-b border-slate-400 hover:border-slate-900">
            uses.tech
          </a>
          .
        </p>

        <div className="mt-14 space-y-12">
          {STACK.map((g) => (
            <div key={g.label}>
              <h2 className="border-t border-slate-900 pt-4 text-xs font-mono uppercase tracking-widest text-slate-500">
                {g.label}
              </h2>
              <ul className="mt-4 space-y-3">
                {g.items.map((it) => (
                  <li key={it.name} className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
                    <span className="w-44 shrink-0 text-base font-semibold tracking-tight text-slate-900">
                      {it.name}
                    </span>
                    <span className="text-sm text-slate-600">{it.note}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex gap-4 font-mono text-[11px] uppercase tracking-widest">
          <Link href="/" className="border-b border-slate-300 pb-0.5 text-slate-600 hover:text-slate-900">
            ← Back home
          </Link>
          <Link href="/about" className="border-b border-slate-900 pb-0.5 text-slate-900 hover:opacity-70">
            About →
          </Link>
          <Link href="/changelog" className="border-b border-slate-900 pb-0.5 text-slate-900 hover:opacity-70">
            Changelog →
          </Link>
        </div>
      </section>
    </main>
  );
}
