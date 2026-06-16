# RankPilot — AI Content & SEO Dashboard

> Multi-tenant SaaS that helps small businesses generate SEO-optimized content,
> schedule it, and track keyword/traffic performance — powered by the Claude API.

---

## 1. Product Overview

**Problem:** Small businesses can't afford agencies or full-time content teams, yet
they need a steady stream of SEO-optimized blog posts, product descriptions, and
social copy to rank and convert.

**Solution:** A self-serve dashboard where a business connects its site, picks target
keywords, and gets AI-generated, on-brand content it can review, schedule, and publish —
with analytics showing what's working.

**Target users:**
- Solo founders & SMB owners (primary)
- Marketing freelancers managing a few clients (power users → drive the multi-workspace feature)

**Business model:** Tiered monthly subscription (Free / Pro / Agency) metered by
generated-content credits and number of tracked sites.

---

## 2. Personas & Core Jobs-to-be-Done

| Persona | Goal | Key features used |
|---|---|---|
| Bilal, café owner | "Get found on Google for 'best coffee near me'" | Keyword research, blog generator, scheduling |
| Sara, freelance marketer | "Manage content for 5 clients in one place" | Workspaces, roles, bulk generation, reporting |
| Omar, Shopify seller | "Write 200 product descriptions fast" | Bulk product-description generator, brand voice |

---

## 3. Feature Spec

### 3.1 Authentication & Accounts
- Email/password + OAuth (Google) sign-up.
- Email verification, password reset, session management.
- **Multi-tenancy:** every user belongs to one or more **Workspaces**. All data
  (sites, content, keywords) is scoped to a workspace.
- **Roles per workspace:** `Owner`, `Admin`, `Editor`, `Viewer` (RBAC enforced
  server-side on every query).
- Workspace invitations via email link.

### 3.2 Site / Brand Setup
- Add a **Site**: URL, industry, target audience, brand voice (tone sliders +
  free-text guidelines), banned words, preferred CTA.
- Optional: paste a few existing pages → AI extracts brand voice automatically.
- Brand profile is injected into every generation prompt for consistency.

### 3.3 Keyword Research
- Enter a seed topic → app returns keyword ideas with (mocked-or-real) volume,
  difficulty, and intent classification (informational/commercial/transactional).
- Save keywords into **Keyword Lists** per site.
- *MVP:* use a free/static keyword source or a single paid API behind an adapter
  interface so it can be swapped. (Don't block the demo on a paid API.)

### 3.4 AI Content Generation (the hero feature)
- Content types: **Blog post**, **Product description**, **Meta title/description**,
  **Social caption** (LinkedIn/X/Instagram).
- Inputs: target keyword(s), content type, length, brand profile (auto-attached).
- **Streaming output** to the editor (token-by-token) for a premium feel.
- Generated content includes: title, body (Markdown), meta description, suggested
  slug, and an **on-page SEO score** (keyword density, headings, readability,
  meta length) with actionable tips.
- **Regenerate / refine** with instructions ("make it more casual", "add a FAQ").
- Bulk mode: upload a CSV of products/keywords → queue many generations.

### 3.5 Content Workflow & Scheduling
- Statuses: `Draft → In Review → Approved → Scheduled → Published`.
- Rich Markdown editor with live preview.
- **Content calendar** (month/week view) — drag to schedule.
- Background worker publishes/marks-published at scheduled time (and can push to a
  connected CMS via webhook/integration adapter — WordPress first).

### 3.6 Analytics & Reporting
- Per-site dashboard: content published over time, keywords tracked, avg SEO score,
  credits used.
- Keyword rank tracking timeline (mocked or via API adapter).
- Exportable PDF/CSV report per workspace (great for the freelancer persona).

### 3.7 Billing & Plans
- Stripe Checkout + Customer Portal.
- Plans gate: # sites, monthly generation credits, # team members, bulk mode,
  reporting export.
- Usage metering: each generation decrements credits; enforce limits server-side.
- Webhooks keep subscription state in sync (`checkout.session.completed`,
  `customer.subscription.updated/deleted`, `invoice.paid`).

### 3.8 Notifications
- In-app + email: invite received, content approved, schedule published,
  credits low, payment failed.

---

## 4. System Architecture

```
                       ┌─────────────────────────────────────┐
                       │            Browser (SPA)             │
                       │  Next.js App Router + React + TS     │
                       │  Tailwind + shadcn/ui + Recharts     │
                       └───────────────┬─────────────────────┘
                                       │  HTTPS / Server Actions + Route Handlers
                                       ▼
        ┌──────────────────────────────────────────────────────────┐
        │                  Next.js Backend (Node)                   │
        │  • Auth (Auth.js)        • RBAC middleware                │
        │  • REST/RPC route handlers (zod-validated)                │
        │  • Service layer (content, billing, keywords, sites)      │
        │  • Stripe webhooks       • Streaming AI proxy             │
        └───┬───────────────┬──────────────┬───────────────┬───────┘
            │               │              │               │
            ▼               ▼              ▼               ▼
   ┌────────────┐   ┌──────────────┐  ┌──────────┐  ┌──────────────┐
   │ PostgreSQL │   │ Job Queue    │  │ Claude   │  │ Stripe API   │
   │ (Prisma)   │   │ (BullMQ +    │  │ API      │  │ + Webhooks   │
   │ multi-     │   │  Redis)      │  │(messages,│  └──────────────┘
   │ tenant     │   │ scheduled    │  │ streaming│
   └────────────┘   │ publish,     │  │ + tools) │
                    │ bulk gen     │  └──────────┘
                    └──────┬───────┘
                           ▼
                    ┌──────────────┐   ┌────────────────────┐
                    │ Worker proc  │──▶│ Integration adapters│
                    │ (Node)       │   │ WordPress / Keyword │
                    └──────────────┘   │ API / Rank API      │
                                       └────────────────────┘
```

### 4.1 Recommended Stack
- **Frontend:** Next.js 15 (App Router), React, TypeScript, Tailwind CSS, shadcn/ui,
  TanStack Query, Recharts, react-hook-form + zod.
- **Backend:** Next.js route handlers + server actions, Node 20, zod validation.
- **DB:** PostgreSQL via Prisma ORM (Neon/Supabase managed).
- **Auth:** Auth.js (NextAuth) with Prisma adapter; JWT sessions.
- **Queue/cache:** Redis + BullMQ for scheduled publishing & bulk generation.
- **AI:** Anthropic Claude API (`claude-sonnet-4-6` for quality, `claude-haiku-4-5`
  for cheap bulk/scoring), streaming via SSE.
- **Payments:** Stripe (Checkout, Customer Portal, webhooks).
- **Email:** Resend (transactional).
- **Deploy:** Vercel (web) + Neon (Postgres) + Upstash (Redis) + a small worker on
  Railway/Render. All free tiers cover a demo.
- **Tooling:** pnpm, ESLint, Prettier, Vitest + Playwright, GitHub Actions CI.

### 4.2 Why these choices (for your interview)
- One language (TypeScript) across the whole stack → shows end-to-end ownership.
- Managed services keep it deployable on free tiers but architecturally "real."
- Adapter interfaces for keyword/rank/CMS APIs → shows you design for swap-ability
  and don't hard-couple to paid vendors.

---

## 5. Data Model (core tables)

```
User(id, email, name, passwordHash?, image, createdAt)
Workspace(id, name, plan, stripeCustomerId, createdAt)
Membership(id, userId, workspaceId, role)               // RBAC join table
Site(id, workspaceId, url, industry, audience, brandVoiceJson, bannedWords)
KeywordList(id, siteId, name)
Keyword(id, keywordListId, term, volume, difficulty, intent)
Content(id, siteId, type, title, bodyMd, metaDesc, slug, status,
        seoScore, targetKeywordId, scheduledAt, publishedAt, createdById)
ContentRevision(id, contentId, bodyMd, createdAt)        // version history
GenerationJob(id, workspaceId, type, status, inputJson, costCredits)
UsageEvent(id, workspaceId, type, credits, createdAt)    // metering/audit
Subscription(id, workspaceId, stripeSubId, status, plan, currentPeriodEnd)
Invitation(id, workspaceId, email, role, token, expiresAt)
Notification(id, userId, type, payloadJson, readAt)
```

**Tenancy rule:** every query is filtered by `workspaceId` derived from the session +
membership check — never trust a client-supplied workspace id.

---

## 6. Key API Surface (representative)

```
POST   /api/auth/*                      Auth.js
GET    /api/workspaces                  list my workspaces
POST   /api/workspaces                  create
POST   /api/workspaces/:id/invite       invite member (Admin+)
GET    /api/sites?workspaceId=          list sites
POST   /api/sites                       create site
POST   /api/keywords/research           seed topic -> ideas
POST   /api/content/generate            stream AI content (SSE)
POST   /api/content/:id/refine          regenerate with instructions
PATCH  /api/content/:id/status          workflow transition (RBAC)
POST   /api/content/bulk                enqueue CSV bulk job
GET    /api/analytics/overview          dashboard metrics
POST   /api/billing/checkout            create Stripe Checkout session
POST   /api/billing/portal              customer portal link
POST   /api/webhooks/stripe             subscription sync
```

All mutating routes: zod-validate body → check membership/role → service call →
typed response. Generation routes also check + decrement credits atomically.

---

## 7. AI Integration Details

- **Prompt assembly:** system prompt = brand profile + SEO rules; user prompt =
  content type + keyword + constraints. Keep prompts in a versioned `/prompts` module.
- **Structured output:** use a tool/JSON schema so the model returns
  `{title, bodyMd, metaDesc, slug, seoScore, tips[]}` — easy to store & render.
- **Streaming:** proxy Claude's stream to the browser via SSE for live typing.
- **Cost control:** Haiku for SEO scoring + bulk; Sonnet for hero blog generation.
  Cache brand-voice extraction. Count tokens to map to credits.
- **Safety/guardrails:** validate model JSON with zod; retry with repair prompt on
  parse failure; rate-limit per workspace.

> See the project's Claude API reference before implementing — confirm current model
> ids, streaming, and tool-use shapes rather than relying on memory.

---

## 8. Security & Multi-Tenancy Checklist
- Server-side RBAC on every workspace-scoped query (no client trust).
- Row scoping by `workspaceId`; consider Postgres RLS for defense-in-depth.
- Stripe webhook signature verification; idempotent handlers.
- Secrets in env vars; never expose the Anthropic key to the client (proxy only).
- Input validation with zod at every boundary; rate limiting on AI + auth routes.
- Audit log via `UsageEvent`.

---

## 9. Suggested Build Phases (portfolio-friendly milestones)

1. **Foundation** — repo, Next.js + TS + Tailwind, Prisma schema, Auth.js,
   workspace + membership + RBAC. *(Deployable skeleton.)*
2. **Sites & Keywords** — site CRUD, brand profile, keyword research (adapter).
3. **AI Generation** — streaming content generator + SEO scoring + editor. *(The demo centerpiece.)*
4. **Workflow & Calendar** — statuses, scheduling, BullMQ worker, WordPress publish.
5. **Billing** — Stripe plans, credit metering, gating.
6. **Analytics & Reporting** — dashboards, export.
7. **Polish** — empty states, loading skeletons, responsive, e2e tests, README +
   architecture diagram + live deploy.

> For a strong portfolio piece, Phases 1–3 deployed live already beat 90% of
> submissions. Phases 4–6 turn it into a "this could be a real company" project.

---

## 10. README / Demo Checklist (what recruiters see first)
- Live URL + seeded demo account (no signup friction).
- 60-sec Loom walkthrough.
- Architecture diagram (this doc's section 4).
- "Tech decisions & trade-offs" section.
- Screenshots/GIF of streaming generation.
- Clear local setup (`.env.example`, `pnpm dev`, seed script).
