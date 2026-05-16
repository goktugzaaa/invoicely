import Link from "next/link";
import { Brand } from "@/components/Logo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Mockup } from "@/components/landing/Mockup";
import { FaqAccordion } from "@/components/landing/FaqAccordion";
import { Marquee } from "@/components/landing/Marquee";
import { StatCounter } from "@/components/landing/StatCounter";
import { Reveal } from "@/components/landing/Reveal";
import { COUNTRIES } from "@/lib/countries";
import { LOCALES, LOCALE_LABELS } from "@/lib/i18n/dict";
import { getDict } from "@/lib/i18n/server";

export default async function LandingPage() {
  const t = await getDict();

  const features = [
    { num: "01", tt: t.landing.f1Title, dd: t.landing.f1Desc },
    { num: "02", tt: t.landing.f2Title, dd: t.landing.f2Desc },
    { num: "03", tt: t.landing.f3Title, dd: t.landing.f3Desc },
    { num: "04", tt: t.landing.f4Title, dd: t.landing.f4Desc },
    { num: "05", tt: t.landing.f5Title, dd: t.landing.f5Desc },
    { num: "06", tt: t.landing.f6Title, dd: t.landing.f6Desc },
    { num: "07", tt: t.landing.f7Title, dd: t.landing.f7Desc },
    { num: "08", tt: t.landing.f8Title, dd: t.landing.f8Desc },
    { num: "09", tt: t.landing.f9Title, dd: t.landing.f9Desc },
  ];

  const personas = [
    { tt: t.landing.p1Title, dd: t.landing.p1Desc },
    { tt: t.landing.p2Title, dd: t.landing.p2Desc },
    { tt: t.landing.p3Title, dd: t.landing.p3Desc },
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
    <main className="min-h-screen overflow-x-hidden bg-[#f8f7f4] text-slate-900 selection:bg-slate-900 selection:text-white">
      {/* Top nav */}
      <header className="sticky top-0 z-40 border-b border-slate-900/10 bg-[#f8f7f4]/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Brand size="md" href="/" />
          <nav className="hidden items-center gap-7 text-xs font-medium uppercase tracking-widest text-slate-700 md:flex">
            <a href="#features" className="hover:text-slate-900">{t.landing.navFeatures}</a>
            <a href="#countries" className="hover:text-slate-900">{t.landing.navCountries}</a>
            <a href="#faq" className="hover:text-slate-900">{t.landing.navFaq}</a>
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              href="/signup"
              className="hidden rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-slate-700 sm:inline-block"
            >
              {t.landing.getStarted}
            </Link>
          </div>
        </div>
      </header>

      {/* HERO — editorial */}
      <section className="relative">
        {/* vertical side label */}
        <div className="pointer-events-none absolute left-6 top-1/2 hidden -translate-y-1/2 [writing-mode:vertical-rl] text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-500 lg:block">
          {t.landing.heroEyebrow}
        </div>

        <div className="mx-auto max-w-7xl px-6 pb-16 pt-20 lg:pt-32">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
            {/* Stacked headline */}
            <Reveal className="lg:col-span-8">
              <h1 className="font-sans text-6xl font-semibold leading-[0.92] tracking-[-0.04em] sm:text-7xl lg:text-[clamp(5rem,9vw,9.5rem)]">
                <span className="block">{t.landing.heroLine1}</span>
                <span className="block font-serif italic text-slate-600">{t.landing.heroLine2}</span>
                <span className="block">{t.landing.heroLine3}</span>
              </h1>
            </Reveal>

            {/* Right column: deck + CTAs */}
            <Reveal delay={150} className="flex flex-col justify-end lg:col-span-4">
              <p className="max-w-md text-base leading-relaxed text-slate-600 sm:text-lg">
                {t.landing.heroDeck}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/login?demo=1" className="group">
                  <span className="inline-flex h-12 items-center gap-2 rounded-full bg-slate-900 px-6 text-sm font-medium text-white transition-colors hover:bg-slate-700">
                    {t.landing.heroPrimary}
                    <span className="transition-transform group-hover:translate-x-0.5">→</span>
                  </span>
                </Link>
                <Link href="/signup">
                  <span className="inline-flex h-12 items-center rounded-full border border-slate-900/15 bg-transparent px-6 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-900/5">
                    {t.landing.heroSecondary}
                  </span>
                </Link>
              </div>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-slate-400">
                {t.landing.noCard} · {t.landing.demoHint}
              </p>
            </Reveal>
          </div>

          {/* Mockup */}
          <Reveal delay={250} className="mt-16 lg:mt-24">
            <Mockup />
          </Reveal>
        </div>
      </section>

      {/* Marquee */}
      <Marquee text={t.landing.marqueeText} />

      {/* MANIFESTO — full bleed dark */}
      <section className="relative bg-[#0c1a3a] py-32 text-white sm:py-40">
        {/* grid texture */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6">
          <Reveal>
            <p className="mb-10 font-mono text-[11px] uppercase tracking-[0.4em] text-white/60">
              — {t.landing.manifestoEyebrow}
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.025em] sm:text-6xl lg:text-7xl">
              <span className="block">{t.landing.manifestoLine1}</span>
              <span className="block font-serif italic text-white/70">{t.landing.manifestoLine2}</span>
              <span className="mt-6 block">{t.landing.manifestoLine3}</span>
              <span className="block">{t.landing.manifestoLine4}</span>
              <span className="block font-serif italic text-white/70">{t.landing.manifestoLine5}</span>
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-14 max-w-2xl text-lg leading-relaxed text-white/70">
              {t.landing.manifestoBody}
            </p>
          </Reveal>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-slate-900/10 bg-[#f8f7f4] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <p className="mb-12 font-mono text-[11px] uppercase tracking-[0.4em] text-slate-500">
              — {t.landing.statBlockEyebrow}
            </p>
          </Reveal>
          <div className="grid grid-cols-2 gap-12 lg:grid-cols-4">
            {[
              { v: 23, suffix: "", label: t.landing.statCountries },
              { v: 16, suffix: "", label: t.landing.statCurrencies },
              { v: 60, suffix: "s", label: t.landing.statSeconds },
              { v: 100, suffix: "%", label: t.landing.statOpenSource },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 100} className="border-t border-slate-900 pt-4">
                <div className="font-sans text-6xl font-semibold tracking-[-0.04em] sm:text-7xl">
                  <StatCounter to={s.v} suffix={s.suffix} />
                </div>
                <p className="mt-2 max-w-[12rem] text-sm text-slate-600">{s.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES — editorial grid, no cards */}
      <section id="features" className="bg-[#f8f7f4] py-32">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.4em] text-slate-500">
              — {t.landing.sectionFeaturesEyebrow}
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="max-w-4xl text-4xl font-semibold leading-[1.05] tracking-[-0.025em] sm:text-6xl">
              {t.landing.sectionFeaturesTitle.split(".")[0]}.
              <span className="font-serif italic text-slate-500">
                {t.landing.sectionFeaturesTitle.includes(".") ? " " + t.landing.sectionFeaturesTitle.split(".").slice(1).join(".") : ""}
              </span>
            </h2>
          </Reveal>

          <div className="mt-20 grid grid-cols-1 gap-x-12 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <Reveal key={f.num} delay={(i % 3) * 80}>
                <div className="group">
                  <div className="flex items-baseline gap-4 border-t border-slate-900/15 pt-4 transition-colors group-hover:border-slate-900">
                    <span className="font-mono text-xs font-semibold text-slate-400">{f.num}</span>
                    <h3 className="text-2xl font-semibold tracking-tight">{f.tt}</h3>
                  </div>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-600">{f.dd}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PERSONAS */}
      <section className="border-y border-slate-900/10 bg-white py-32">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.4em] text-slate-500">
              — {t.landing.sectionPersonasEyebrow}
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="max-w-4xl text-4xl font-semibold leading-[1.05] tracking-[-0.025em] sm:text-6xl">
              {t.landing.sectionPersonasTitle}
            </h2>
          </Reveal>
          <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3">
            {personas.map((p, i) => (
              <Reveal key={p.tt} delay={i * 80}>
                <div className="border-t border-slate-900 pt-6">
                  <h3 className="text-3xl font-semibold tracking-tight">{p.tt}</h3>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-600">{p.dd}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* COUNTRIES */}
      <section id="countries" className="bg-[#f8f7f4] py-32">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.4em] text-slate-500">
              — {t.landing.coverageEyebrow}
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="max-w-4xl text-4xl font-semibold leading-[1.05] tracking-[-0.025em] sm:text-6xl">
              {t.landing.countriesTitle}
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="mt-5 max-w-2xl text-base text-slate-600">{t.landing.countriesSub}</p>
          </Reveal>

          <Reveal delay={200} className="mt-14">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {COUNTRIES.map((c) => (
                <div
                  key={c.code}
                  className="flex items-center gap-2 border-t border-slate-900/15 pt-3 text-sm transition-colors hover:border-slate-900"
                  title={`${c.taxLabel} ${c.taxRate}% · ${c.currency}`}
                >
                  <span className="text-base leading-none">{c.flag}</span>
                  <span className="flex-1 truncate font-medium text-slate-900">{c.name}</span>
                  <span className="font-mono text-[10px] text-slate-400">{c.currency}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={250} className="mt-12">
            <p className="max-w-3xl text-sm leading-relaxed text-slate-600">
              <span className="font-semibold text-slate-900">Note —</span> {t.landing.countriesNote}
            </p>
          </Reveal>

          {/* Languages */}
          <Reveal delay={300} className="mt-16">
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-slate-500">
              — {t.landing.languagesTitle}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {LOCALES.map((l) => (
                <span
                  key={l}
                  className="inline-flex items-center gap-2 border border-slate-900/15 px-3 py-1.5 text-xs font-medium uppercase tracking-widest text-slate-900"
                >
                  {l} · <span className="normal-case tracking-normal text-slate-500">{LOCALE_LABELS[l]}</span>
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* COMPARE */}
      <section className="border-y border-slate-900/10 bg-white py-32">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.4em] text-slate-500">
              — {t.landing.sectionCompareEyebrow}
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.025em] sm:text-6xl">
              {t.landing.sectionCompareTitle}
            </h2>
          </Reveal>
          <Reveal delay={150} className="mt-14">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-t border-b border-slate-900 text-left text-xs uppercase tracking-widest text-slate-500">
                  <th className="py-4 font-medium">{t.landing.compareCol1}</th>
                  <th className="py-4 font-medium">{t.landing.compareCol2}</th>
                  <th className="py-4 font-medium text-slate-900">{t.landing.compareCol3}</th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row, i) => (
                  <tr key={i} className="border-b border-slate-200">
                    <td className="py-5 pr-4 text-slate-400 line-through">{row[0]}</td>
                    <td className="py-5 pr-4 text-slate-400 line-through">{row[1]}</td>
                    <td className="py-5 pr-4 font-medium text-slate-900">
                      <span className="mr-2 inline-block">✓</span>{row[2]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS — editorial oversized */}
      <section className="bg-[#f8f7f4] py-32">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.4em] text-slate-500">
              — {t.landing.sectionTestiEyebrow}
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.025em] sm:text-6xl">
              {t.landing.sectionTestiTitle}
            </h2>
          </Reveal>

          <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-3">
            {testimonials.map((tm, i) => (
              <Reveal key={tm.n} delay={i * 100}>
                <figure className="border-t border-slate-900 pt-6">
                  <blockquote className="font-serif text-2xl leading-[1.2] tracking-tight text-slate-900 sm:text-3xl">
                    &ldquo;{tm.q}&rdquo;
                  </blockquote>
                  <figcaption className="mt-6 font-mono text-[11px] uppercase tracking-widest text-slate-500">
                    <span className="font-semibold text-slate-900">{tm.n}</span>
                    <span className="mx-2">·</span>
                    {tm.r}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-slate-900/10 bg-white py-32">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.4em] text-slate-500">
              — {t.landing.sectionFaqEyebrow}
            </p>
            <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.025em] sm:text-5xl">
              {t.landing.sectionFaqTitle}
            </h2>
          </Reveal>
          <Reveal delay={100} className="lg:col-span-8">
            <FaqAccordion items={faqs} />
          </Reveal>
        </div>
      </section>

      {/* FINAL CTA — full bleed dark */}
      <section className="bg-[#0c1a3a] py-32 text-white sm:py-40">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-white/60">
              — {t.landing.ctaEyebrow}
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-8 text-5xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-7xl lg:text-8xl">
              <span className="block">{t.landing.ctaBigLine1}</span>
              <span className="block font-serif italic text-white/70">{t.landing.ctaBigLine2}</span>
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="mx-auto mt-8 max-w-xl text-base text-white/70">{t.landing.ctaBigSub}</p>
          </Reveal>
          <Reveal delay={300}>
            <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/login?demo=1" className="group">
                <span className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-200">
                  {t.landing.ctaBtnPrimary}
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </span>
              </Link>
              <Link href="/signup">
                <span className="inline-flex h-12 items-center rounded-full border border-white/30 px-7 text-sm font-medium text-white transition-colors hover:bg-white/10">
                  {t.landing.ctaBtnSecondary}
                </span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-900/10 bg-[#f8f7f4]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Brand size="md" href="/" />
            <p className="font-serif text-lg italic text-slate-600">{t.landing.footerTagline}</p>
          </div>
          <div>
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">
              {t.landing.footerLinks}
            </p>
            <ul className="space-y-2 text-sm text-slate-700">
              <li><a href="#features" className="hover:text-slate-900">{t.landing.navFeatures}</a></li>
              <li><a href="#countries" className="hover:text-slate-900">{t.landing.navCountries}</a></li>
              <li><a href="#faq" className="hover:text-slate-900">{t.landing.navFaq}</a></li>
              <li><Link href="/login" className="hover:text-slate-900">{t.landing.signIn}</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">
              {t.landing.footerLegal}
            </p>
            <ul className="space-y-2 text-sm text-slate-700">
              <li><span className="text-slate-500">Privacy — coming soon</span></li>
              <li><span className="text-slate-500">Terms — coming soon</span></li>
            </ul>
          </div>
          <div>
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">
              Index
            </p>
            <p className="font-serif text-2xl italic text-slate-900">v.01</p>
            <p className="mt-2 text-sm text-slate-600">{t.landing.footerMade}</p>
          </div>
        </div>
        <div className="border-t border-slate-900/10">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 text-xs text-slate-500">
            <p>{t.landing.footer}</p>
            <p className="font-mono uppercase tracking-widest">paidly.app</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
