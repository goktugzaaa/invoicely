import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Brand } from "@/components/Logo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Mockup } from "@/components/landing/Mockup";
import { FaqAccordion } from "@/components/landing/FaqAccordion";
import { COUNTRIES } from "@/lib/countries";
import { LOCALES, LOCALE_LABELS } from "@/lib/i18n/dict";
import { getDict } from "@/lib/i18n/server";

export default async function LandingPage() {
  const t = await getDict();

  const features = [
    { tt: t.landing.f1Title, dd: t.landing.f1Desc, icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1", color: "bg-emerald-50 text-emerald-600" },
    { tt: t.landing.f2Title, dd: t.landing.f2Desc, icon: "M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21l-7-3-7 3V5a2 2 0 012-2h10a2 2 0 012 2v16z", color: "bg-amber-50 text-amber-600" },
    { tt: t.landing.f3Title, dd: t.landing.f3Desc, icon: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2zM9 17h6m-6-4h6m-6-4h2", color: "bg-brand-50 text-brand-600" },
    { tt: t.landing.f4Title, dd: t.landing.f4Desc, icon: "M13 10V3L4 14h7v7l9-11h-7z", color: "bg-rose-50 text-rose-600" },
    { tt: t.landing.f5Title, dd: t.landing.f5Desc, icon: "M3 3v18h18M7 16V9m4 7V5m4 11v-3m4 3V11", color: "bg-violet-50 text-violet-600" },
    { tt: t.landing.f6Title, dd: t.landing.f6Desc, icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", color: "bg-slate-100 text-slate-600" },
    { tt: t.landing.f7Title, dd: t.landing.f7Desc, icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z", color: "bg-cyan-50 text-cyan-600" },
    { tt: t.landing.f8Title, dd: t.landing.f8Desc, icon: "M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129", color: "bg-pink-50 text-pink-600" },
    { tt: t.landing.f9Title, dd: t.landing.f9Desc, icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4", color: "bg-indigo-50 text-indigo-600" },
  ];

  const personas = [
    { tt: t.landing.p1Title, dd: t.landing.p1Desc, emoji: "💼" },
    { tt: t.landing.p2Title, dd: t.landing.p2Desc, emoji: "🏢" },
    { tt: t.landing.p3Title, dd: t.landing.p3Desc, emoji: "🌍" },
  ];

  const compareRows = [
    [t.landing.cmp1, t.landing.cmp2, t.landing.cmp3],
    [t.landing.cmp4, t.landing.cmp5, t.landing.cmp6],
    [t.landing.cmp7, t.landing.cmp8, t.landing.cmp9],
  ];

  const testimonials = [
    { q: t.landing.t1Quote, n: t.landing.t1Name, r: t.landing.t1Role },
    { q: t.landing.t2Quote, n: t.landing.t2Name, r: t.landing.t2Role },
    { q: t.landing.t3Quote, n: t.landing.t3Name, r: t.landing.t3Role },
  ];

  const faqs = [
    { q: t.landing.faq1Q, a: t.landing.faq1A },
    { q: t.landing.faq2Q, a: t.landing.faq2A },
    { q: t.landing.faq3Q, a: t.landing.faq3A },
    { q: t.landing.faq4Q, a: t.landing.faq4A },
    { q: t.landing.faq5Q, a: t.landing.faq5A },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Top nav */}
      <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Brand size="md" href="/" />
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <a href="#features" className="hover:text-slate-900">{t.landing.navFeatures}</a>
            <a href="#faq" className="hover:text-slate-900">{t.landing.navFaq}</a>
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link href="/login" className="hidden text-sm font-medium text-slate-700 hover:text-slate-900 sm:inline">
              {t.landing.signIn}
            </Link>
            <Link href="/signup">
              <Button>{t.landing.getStarted}</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* gradient blob bg */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-br from-brand-200/40 via-violet-200/30 to-emerald-200/30 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.6),transparent_50%)]" />
        </div>

        <div className="mx-auto max-w-6xl px-6 pt-16 pb-12 text-center sm:pt-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            {t.landing.badge}
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight text-slate-900 sm:text-6xl">
            {t.landing.headlinePre}{" "}
            <span className="text-brand-gradient">{t.landing.headlineHighlight}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
            {t.landing.sub}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/login?demo=1">
              <Button size="lg" className="px-7">{t.landing.tryDemo}</Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" variant="outline" className="px-7">{t.landing.createFree}</Button>
            </Link>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            {t.landing.noCard} <span className="mx-2 text-slate-300">·</span>
            <span className="font-mono text-slate-500">{t.landing.demoHint}</span>
          </p>
        </div>

        <div className="mx-auto max-w-5xl px-6 pb-20">
          <Mockup />
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-slate-100 bg-slate-50/50">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <p className="text-center text-xs uppercase tracking-widest text-slate-500">
            {t.landing.trustText}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-60">
            {["acme", "globex", "initech", "umbrella", "stark", "wayne"].map((n) => (
              <span key={n} className="text-lg font-semibold uppercase tracking-widest text-slate-400">
                {n}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {t.landing.featuresTitle}
          </h2>
          <p className="mt-3 text-slate-600">{t.landing.featuresSub}</p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.tt}
              className="group rounded-xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${f.color}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                </svg>
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900">{f.tt}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{f.dd}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Personas */}
      <section className="bg-slate-50/60 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              {t.landing.personasTitle}
            </h2>
            <p className="mt-3 text-slate-600">{t.landing.personasSub}</p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {personas.map((p) => (
              <div
                key={p.tt}
                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-shadow hover:shadow-md"
              >
                <span className="text-3xl">{p.emoji}</span>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{p.tt}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.dd}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {t.landing.howTitle}
          </h2>
          <p className="mt-3 text-slate-600">{t.landing.howSub}</p>
        </div>
        <div className="relative mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div
            aria-hidden
            className="absolute left-12 right-12 top-7 hidden h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent md:block"
          />
          {[
            { n: "01", tt: t.landing.step1Title, dd: t.landing.step1Desc },
            { n: "02", tt: t.landing.step2Title, dd: t.landing.step2Desc },
            { n: "03", tt: t.landing.step3Title, dd: t.landing.step3Desc },
          ].map((s) => (
            <div key={s.n} className="relative rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
              <span className="absolute -top-4 left-7 inline-flex h-8 items-center rounded-full bg-brand-600 px-3 text-xs font-bold text-white shadow">
                {s.n}
              </span>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">{s.tt}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.dd}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Country & Language coverage */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {t.landing.countriesTitle}
          </h2>
          <p className="mt-3 text-slate-600">{t.landing.countriesSub}</p>
        </div>

        {/* Countries grid */}
        <div className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {COUNTRIES.map((c) => (
            <div
              key={c.code}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm"
              title={`${c.taxLabel} ${c.taxRate}% · ${c.currency}`}
            >
              <span className="text-base leading-none">{c.flag}</span>
              <span className="flex-1 truncate font-medium text-slate-800">{c.name}</span>
              <span className="font-mono text-xs text-slate-400">{c.currency}</span>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-slate-200 bg-slate-50/60 p-5 text-sm text-slate-700">
          <p>{t.landing.countriesNote}</p>
        </div>

        {/* Languages */}
        <div className="mt-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            {t.landing.languagesTitle}
          </p>
          <div className="mt-4 inline-flex flex-wrap items-center justify-center gap-2">
            {LOCALES.map((l) => (
              <span
                key={l}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm"
              >
                <span className="uppercase text-slate-400">{l}</span>
                <span>{LOCALE_LABELS[l]}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Compare table */}
      <section className="bg-slate-50/60 py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              {t.landing.compareTitle}
            </h2>
            <p className="mt-3 text-slate-600">{t.landing.compareSub}</p>
          </div>
          <div className="mt-12 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-left text-xs uppercase tracking-widest text-slate-500">
                <tr>
                  <th className="px-6 py-4">{t.landing.compareCol1}</th>
                  <th className="px-6 py-4">{t.landing.compareCol2}</th>
                  <th className="bg-brand-600 px-6 py-4 text-white">{t.landing.compareCol3}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {compareRows.map((row, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 text-slate-500 line-through opacity-70">{row[0]}</td>
                    <td className="px-6 py-4 text-slate-500 line-through opacity-70">{row[1]}</td>
                    <td className="bg-brand-50/60 px-6 py-4 font-medium text-slate-900">
                      <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-xs text-white">✓</span>
                      {row[2]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-50/60 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              {t.landing.testimonialsTitle}
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((tm) => (
              <figure
                key={tm.n}
                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
              >
                <div className="text-amber-400">
                  {"★★★★★".split("").map((s, i) => (
                    <span key={i}>{s}</span>
                  ))}
                </div>
                <blockquote className="mt-3 text-sm leading-relaxed text-slate-700">
                  &ldquo;{tm.q}&rdquo;
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                    {tm.n.split(" ")[0][0]}
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-slate-900">{tm.n}</span>
                    <span className="block text-xs text-slate-500">{tm.r}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-6 py-24">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {t.landing.faqTitle}
          </h2>
        </div>
        <div className="mt-10">
          <FaqAccordion items={faqs} />
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1a3a] via-[#1a2bb0] to-brand-600 px-8 py-16 text-center text-white shadow-2xl">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.3), transparent 40%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.2), transparent 40%)",
            }}
          />
          <h2 className="relative text-3xl font-semibold tracking-tight sm:text-4xl">{t.landing.ctaTitle}</h2>
          <p className="relative mx-auto mt-3 max-w-xl text-white/80">{t.landing.ctaSub}</p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/login?demo=1">
              <Button size="lg" className="bg-white px-7 text-slate-900 hover:bg-slate-100">
                {t.landing.tryDemo}
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" variant="outline" className="border-white/40 bg-transparent px-7 text-white hover:bg-white/10 hover:text-white">
                {t.landing.createFree}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <Brand size="sm" href="/" />
          <nav className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
            <a href="#features" className="hover:text-slate-700">{t.landing.navFeatures}</a>
            <a href="#faq" className="hover:text-slate-700">{t.landing.navFaq}</a>
            <Link href="/login" className="hover:text-slate-700">{t.landing.signIn}</Link>
          </nav>
          <p className="text-xs text-slate-400">{t.landing.footer}</p>
        </div>
      </footer>
    </main>
  );
}
