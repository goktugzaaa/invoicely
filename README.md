<div align="center">

# Paidly

**A production-quality invoice & client tracker SaaS for freelancers and small agencies.**

Track clients, send branded PDF invoices, and watch revenue land — without spreadsheets.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres%20%2B%20Auth-3ecf8e?logo=supabase&logoColor=white)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000?logo=vercel)](https://vercel.com/)

### **[🚀 Live Demo](https://invoicely-psi.vercel.app) · [⚡ One-Click Demo Login](https://invoicely-psi.vercel.app/login?demo=1)**

</div>

---

## 🎯 What it is

A real SaaS — not a tutorial project. Built end-to-end with the modern Next.js + Supabase stack, multi-tenant from day one, with the polish freelancers and agencies actually need:

- **Clients module** — full CRUD, status, notes, per-client invoice history
- **Invoices module** — auto-numbered `INV-####`, multi-line items, multi-currency, tax & discount, status pipeline (`draft → sent → paid → overdue`)
- **Branded PDF export** — server-rendered with your logo, business info, totals breakdown
- **Smart dashboard** — revenue trend (12 months), status mix, activity feed, date range filter (7d/30d/90d/12m), onboarding checklist
- **Multi-tenant auth** — Supabase Auth + Row-Level Security on every table. Users only ever see their own data
- **i18n** — English + Turkish, swappable via header toggle
- **Production touches** — toasts, skeleton loaders, empty states with illustrations, micro-interactions, gradient brand identity

## 🧪 Try the live demo

| Field | Value |
|---|---|
| URL | https://invoicely-psi.vercel.app |
| One-click demo | https://invoicely-psi.vercel.app/login?demo=1 |
| Email | `demo@paidly.app` |
| Password | `Demo1234!` |

Demo workspace ships pre-loaded with 8 clients, 11 invoices spanning 7 months, multiple currencies (USD/EUR/GBP/TRY), and the full activity timeline.

## 🛠 Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15** (App Router, Server Components, Server Actions) | Type-safe end-to-end, RSC for fast loads, Server Actions remove API route boilerplate |
| Language | **TypeScript** (strict) | Catch the bugs at compile time |
| Styling | **Tailwind CSS** + custom design system | Hand-rolled UI components — no shadcn bloat |
| Auth + DB | **Supabase** (Postgres + Auth + Storage + RLS) | Real RLS multi-tenancy out of the box |
| Forms | **React Hook Form** + **Zod** | Schema-first validation, shared between client and server |
| PDF | **pdf-lib** | Server-rendered, branded, deterministic |
| Charts | **Recharts** | Lightweight, customizable |
| Hosting | **Vercel** (auto-deploy from `main`) | Zero-config Next.js, edge functions, preview deployments |

## 📦 Features at a glance

### Authentication
- Email + password via Supabase Auth
- Middleware-gated routes (`/dashboard`, `/clients`, `/invoices`, `/settings`)
- Multi-tenant by `auth.uid()` — every row owned and protected by RLS policies
- Login redirect with `?redirect=` preservation
- Demo workspace via `?demo=1` query (auto-fills + signs in)

### Clients
- CRUD with status (`active`/`inactive`), notes, contact info
- Search (name/email/company), status filter, pagination
- Detail page with invoice history per client
- Empty states with custom illustrations

### Invoices
- Auto-numbered per user (`INV-0001`, `INV-0002` …) via Postgres RPC
- Multi-line items with live total calculation
- 16 supported currencies with locale-aware formatting (USD/EUR/GBP/TRY/CAD/AUD/NZD/CHF/SEK/NOK/DKK/PLN/ZAR/SGD/HKD/JPY)
- Per-invoice tax %, discount amount, breakdown displayed everywhere (form, detail, PDF)
- Status pipeline with one-click transitions (`Mark sent`, `Mark paid`)
- Audit timestamps (`sent_at`, `paid_at`) populated automatically
- **"Create & download PDF"** double CTA — one click → invoice created + PDF opens in new tab

### PDF export
- Server-rendered A4 PDF via `pdf-lib`
- Branded header with your business name, address, tax ID
- Embedded logo (PNG/JPG support, pulled from Supabase Storage)
- Totals breakdown (subtotal / discount / tax / total)
- Streams from `/api/invoices/:id/pdf`

### Dashboard
- Welcome card with brand accent + range toggle (7d / 30d / 90d / 12m)
- 3 stat cards: revenue (ranged), outstanding, active clients
- Quick actions (Create invoice / Add client / Brand invoices)
- Revenue bar chart (last 12 months)
- Status mix list (progress bars per status)
- **Activity feed**: created/sent/paid invoices + client adds, with relative timestamps + payment amounts
- First-time onboarding card with progress bar (Settings → Client → Invoice)

### Settings
- Business profile (name, address, tax ID, default currency)
- Logo upload to Supabase Storage (owner-scoped policy, public read)
- Live preview, replace, remove

### Polish
- Toast notifications via URL `?flash=` flash messaging (no client state library)
- Skeleton loaders with shimmer animation
- Custom empty states per page (clients / invoices / generic)
- Brand gradient on hero text + sidebar active indicator + page header accent
- Button hover micro-interactions (brand glow + active scale)
- Custom scrollbar + selection color
- Inter font via `next/font` with OpenType features
- Responsive (desktop sidebar + mobile tab bar)

### i18n
- English + Turkish out of the box
- Cookie-based locale (no URL changes), client + server compatible
- Toggle in header, auth pages, landing
- Dictionary type-safe and tree-shakable

## 🏗 Architecture

```
app/
  (auth)/              Public auth pages (login, signup)
    layout.tsx         Brand-themed shell with gradient blobs
  (app)/               Protected app routes
    layout.tsx         requireUser() + sidebar + topbar
    dashboard/         Greeting, stats, charts, activity, onboarding
    clients/           list, new, [id], [id]/edit + actions
    invoices/          list, new, [id], [id]/edit + actions
    settings/          profile form + logo uploader
  api/
    invoices/[id]/pdf  Server-streams PDF
    locale             Sets locale cookie

components/
  ui/                  Button, Card, Input, Select, Table, Badge,
                       EmptyState, Pagination, FilterBar, Skeleton, PageHeader
  dashboard/           Charts, RangeToggle, QuickActions, ActivityFeed, Onboarding
  landing/             Mockup, FaqAccordion
  Brand / Logo / Sidebar / Topbar / MobileNav / LanguageSwitcher / Toast

lib/
  supabase/            server / client / middleware
  i18n/                dict (EN+TR) + server util + client provider
  auth.ts              requireUser() guard
  validation.ts        Zod schemas (client, invoice, profile)
  pdf.ts               Branded PDF renderer
  utils.ts             cn, formatCurrency, formatDate, timeAgo, isOverdue

services/              Data access layer (clients, invoices, dashboard, profile)
types/db.ts            Hand-typed DB shapes
middleware.ts          Auth gate

supabase/
  schema.sql           Tables, enums, RPCs, RLS policies
  seed.sql             Sample data for self-hosting
```

## 🚀 Run locally

```bash
git clone https://github.com/goktugzaaa/invoicely.git
cd invoicely
npm install
cp .env.example .env.local
# Fill NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

### Set up your own Supabase

1. Create a Supabase project ([supabase.com](https://supabase.com))
2. SQL Editor → run [`supabase/schema.sql`](supabase/schema.sql)
3. Auth → URL Configuration → add `http://localhost:3000/**`
4. Storage will auto-create the `logos` bucket via the schema
5. (Optional) edit [`supabase/seed.sql`](supabase/seed.sql) with your `auth.users.id` and run it for demo data

## 🗺 Roadmap

Detailed phased plan in [`ROADMAP.md`](ROADMAP.md) — covers payment integration (Stripe), recurring invoices, email-the-PDF, time tracking, expenses, projects, teams, custom domains, API/webhooks, bank reconciliation, and more.

## 📸 Screens

> Screenshots in `/docs` (coming) — for now: [walk through the live demo →](https://invoicely-psi.vercel.app/login?demo=1)

## 📝 License

MIT — fork, use, learn, sell. Built by [Göktuğ Zaimoğlu](https://github.com/goktugzaaa).

---

<div align="center">

**[Try the live demo →](https://invoicely-psi.vercel.app/login?demo=1)**

If this helped you, a ⭐ on GitHub means a lot.

</div>
