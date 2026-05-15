# Invoicely — Invoice & Client Tracker

A production-quality SaaS MVP for freelancers and small agencies. Track clients, send PDF invoices, watch revenue land — all in one Next.js + Supabase app.

## Stack

- **Next.js 14** (App Router, server actions)
- **TypeScript**
- **Supabase** — Auth + Postgres (with Row Level Security)
- **Tailwind CSS** — handcrafted UI components
- **React Hook Form** + **Zod** — forms & validation
- **pdf-lib** — server-rendered PDF invoices

## Features

- Email/password auth (Supabase Auth) with route protection via middleware.
- Multi-tenant by `auth.uid()` — every row is owned and protected by RLS.
- **Clients**: full CRUD, status (active/inactive), notes, per-client invoice history.
- **Invoices**: auto-numbered `INV-0001`, multi-line items, auto totals, statuses (`draft`, `sent`, `paid`, `overdue`), one-click status transitions.
- **Dashboard**: total revenue (paid), outstanding balance, active client count, recent invoices.
- **PDF export**: clean A4 invoice rendered server-side, served at `/api/invoices/:id/pdf`.
- Responsive layout with sidebar nav (desktop) and tabs (mobile).

## Getting started

### 1. Install

```bash
npm install
```

### 2. Create a Supabase project

- Go to [supabase.com](https://supabase.com), create a new project.
- Copy your **Project URL** and **anon public** API key.
- Open the SQL editor and run the contents of [`supabase/schema.sql`](supabase/schema.sql).

### 3. Environment

Create `.env.local` from the template:

```bash
cp .env.example .env.local
```

Fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign up.

### 5. (Optional) Seed demo data

After signing up, find your `auth.users.id` in the Supabase dashboard, edit `supabase/seed.sql` and replace `REPLACE-WITH-USER-UUID`, then run it in the SQL editor.

## Database schema

Three tables, all owner-scoped via RLS (`auth.uid() = user_id`):

| Table           | Purpose                                                     |
|-----------------|-------------------------------------------------------------|
| `clients`       | name, email, phone, company, notes, status                  |
| `invoices`      | invoice_number, client_id, total_amount, status, dates      |
| `invoice_items` | description, quantity, unit_price, total_price (per invoice)|

Helper functions:
- `next_invoice_number(p_user)` — returns next `INV-####` per user.
- `recalc_invoice_total(p_invoice)` — recomputes invoice total from items.

## Project structure

```
app/
  (auth)/login, signup        — public auth pages
  (app)/
    layout.tsx                — protected shell (sidebar + topbar)
    dashboard/                — stats + recent invoices
    clients/                  — list, new, [id], [id]/edit + actions.ts
    invoices/                 — list, new, [id], [id]/edit + actions.ts
  api/invoices/[id]/pdf       — PDF download endpoint
components/
  ui/                         — Button, Input, Card, Table, Badge, EmptyState…
  Sidebar, Topbar, MobileNav
lib/
  supabase/                   — server, client, middleware
  auth.ts, utils.ts, validation.ts, pdf.ts
services/
  clients.ts, invoices.ts, dashboard.ts
types/db.ts
middleware.ts                 — auth gate
supabase/
  schema.sql, seed.sql
```

## Production notes

- All mutations go through **server actions** that call `requireUser()` and rely on Supabase RLS as the second wall of defense.
- The PDF route streams a freshly rendered document with `Cache-Control: no-store`.
- `dynamic = "force-dynamic"` is used on dashboard/list pages so data is always live per request.

## Scripts

```bash
npm run dev      # local dev
npm run build    # production build
npm run start    # serve built app
npm run lint     # eslint
```

## License

MIT
