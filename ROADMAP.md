# Nib — Product Roadmap

A pragmatic, monetization-aware roadmap to turn the MVP into a sellable, sticky SaaS product. Phases are ordered by **revenue impact ÷ build cost**.

Legend
- 🟢 quick win (≤1 day)
- 🟡 mid (2–5 days)
- 🔴 large (1+ weeks)
- 💰 unlocks paid plans / billing-worthy
- 🔒 trust / security signal
- 🌍 international / SEO

---

## Phase 1 — Earn the first paying users (2–3 weeks)

**Goal:** make the product feel "fair to charge for" — close the loop from invoice → payment.

| Feature | Cost | Why it sells |
|---|---|---|
| 🟡💰 **Stripe Connect "Pay this invoice" link** | mid | Massive — clients click, pay card; you take a fee. PDF gets a Pay button. Single feature that justifies a paid tier. |
| 🟡💰 **Recurring invoices** (cron + Postgres `pg_cron`) | mid | Retainers run forever, no manual work. Pure subscription value. |
| 🟢💰 **Payment reminder emails** (Resend / Postmark) | quick | "Your invoice INV-0042 is overdue." Clients pay 30%+ faster. |
| 🟢 **Email the invoice PDF directly to the client** | quick | Removes the "download then attach to Gmail" step. Massive UX. |
| 🟢🔒 **Audit log per invoice** (created/sent/paid/edited) | quick | Already have `sent_at` / `paid_at` — surface as a timeline on detail page. |
| 🟡 **Quotes / Estimates** (with "convert to invoice" button) | mid | Doubles the use-cases; agencies start every project with a quote. |
| 🟢 **Partial payments / "Mark partially paid"** | quick | Real-world need. Add `paid_amount` column. |
| 🟡 **Late fee + interest auto-add** | mid | Charges teams pay extra for. |

---

## Phase 2 — Expand the workflow (3–4 weeks)

**Goal:** become the daily tool, not just the invoice tool.

| Feature | Cost | Why it sells |
|---|---|---|
| 🟡 **Time tracking** (timer + manual entries → invoice line items) | mid | Replaces Toggl + invoice tool combo. Big retention. |
| 🟡 **Expenses tracker** (with receipt upload to Supabase Storage) | mid | Year-end tax stuff lives here → annual stickiness. |
| 🟡 **Projects** (group invoices + time + expenses) | mid | Agencies need this. Unlocks Team plan. |
| 🟢 **CSV export** (clients, invoices, line items) | quick | Trust signal — "I can leave anytime." Often demanded by accountants. |
| 🟡 **Bulk actions** (mark multiple paid, delete many drafts) | mid | Power-user delight. |
| 🟢 **Saved invoice templates** | quick | One-click "send retainer for Acme" → done. |
| 🟡 **Custom invoice numbering schemes** (`2026-001`, `ACME-{seq}`) | mid | Real businesses care. Often a deal-breaker for switching. |
| 🟢 **Notes & file attachments per client** | quick | Sticky data → switching cost. |

---

## Phase 3 — Trust & growth (3–4 weeks)

**Goal:** look like a company, not a side project. Convert visitors → users.

| Feature | Cost | Why it sells |
|---|---|---|
| 🔴🔒 **Team workspaces** (invite teammates, roles: admin/member) | large | Unlocks Team / Business pricing tier. |
| 🟡🔒 **2FA / TOTP** | mid | Required by any client doing real money. Trust signal. |
| 🟡🔒 **Session management + active devices** | mid | Trust signal in security pages. |
| 🟢🔒 **GDPR / data export & "delete my account"** | quick | Required by EU clients. Cheap to add. |
| 🟡🌍 **Hreflang + locale URLs** (`/en`, `/tr`) | mid | SEO — landing page ranks in both languages. |
| 🟡🌍 **More languages** (DE, ES, FR — auto-translate v1) | mid | Each language = new market. |
| 🟢 **OG image generator** for landing page | quick | Sharing on Twitter / LinkedIn looks pro. |
| 🟡 **Public client portal** (`nib.app/pay/abc123`) | mid | Clients view invoice without an account → faster payment. |
| 🟢 **Status page widget** (uptime badge in footer) | quick | Trust signal. Use BetterUptime free tier. |

---

## Phase 4 — Differentiation & moat (4–8 weeks)

**Goal:** features competitors don't have, that lock users in.

| Feature | Cost | Why it sells |
|---|---|---|
| 🔴 **Bank reconciliation** (Plaid / Tink / GoCardless feed) | large | Auto-mark paid when bank deposit matches. Killer feature. |
| 🔴 **AI-powered categorization** (categorize expenses, suggest tax codes) | large | Modern story. Easy to demo. |
| 🟡 **Tax reports** (VAT summary by quarter, multi-jurisdiction) | mid | Wins accountants. Annual revenue protection. |
| 🟡 **Multi-currency conversion** (live FX from openexchangerates) | mid | International freelancers need this for taxes. |
| 🔴 **API + webhooks + Zapier integration** | large | Power users automate. Doubles addressable market. |
| 🟡 **Custom domains** (`invoices.acme.com`) on Team plan | mid | White-label — agencies will pay extra. |
| 🟡 **Custom invoice templates** (HTML/CSS based) | mid | Differentiates from cookie-cutter tools. |
| 🟡 **Inventory / products catalog** (so line items aren't always typed) | mid | Boutique businesses need this. |
| 🔴 **Mobile app** (React Native / Capacitor wrapper) | large | "On the go" story. Often expected. |
| 🟡 **Stripe Subscriptions billing for Nib itself** | mid | You need this to actually charge. Use Stripe Customer Portal. |

---

## Phase 5 — Compounding moats

| Feature | Why |
|---|---|
| 🔴 **SSO** (Google Workspace, Microsoft) | Sells to the corporate end of "agency" market. |
| 🔴 **Audit & compliance** (SOC2 Type II story — even just "in progress") | Unlocks bigger contracts. |
| 🔴 **Embeddable invoice form** (script tag on freelancer's site) | New growth channel. |
| 🔴 **Marketplace / templates store** | UGC moat. |
| 🔴 **AI assistant** (chat to query your business — "how much did Acme pay last quarter?") | Modern, demoable, sticky. |

---

## What to build *next* (concrete top-3)

If shipping 1 thing: **Stripe Connect "Pay invoice" link**.
If shipping 3: **Pay link → Email PDF to client → Recurring invoices**. 

Those three turn Nib from "invoice generator" into "get paid faster" — which is the actual job to be done.

---

## What to put on the landing page *today* to look bigger

(no code change required — just marketing positioning)

- A logo cloud (use real client logos when you get them)
- A "What's new" changelog (`/changelog`) — looks active
- A demo video (Loom, ≤90 sec) embedded in hero
- A real testimonial from any existing user
- A signup count or revenue tracker ("$X processed", "Y invoices sent")

---

## Pricing plays

- Free: 5 clients, 10 invoices/month → forces upgrade fast
- Pro $9/mo: unlimited, branded PDF, Pay link, recurring
- Team $19/mo per user: workspaces, audit log, custom domain
- Add-on: Stripe processing 0.5% on top of Stripe's fee (revenue share)
- Annual −20% to lock in 12-month MRR

---

## Why this roadmap will sell on Upwork

A buyer skimming a portfolio asks: *"could I run a real freelance business on this Monday morning?"* — Phase 1 closes that question. *"Could I scale this to a team and make money on it?"* — Phase 2–4 is the answer. The roadmap itself is a deliverable: it tells the buyer you've thought about the product, not just the code.
