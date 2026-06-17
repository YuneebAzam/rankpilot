# RankPilot

> AI Content & SEO dashboard for small businesses — a full-stack, multi-tenant
> SaaS. **Phase 1** (this scaffold): auth, multi-tenant workspaces, and RBAC.

Built with Next.js 15 (App Router) · TypeScript · Tailwind v4 · Prisma ·
Auth.js v5. Runs on **SQLite** out of the box for a zero-config demo; the
architecture targets **PostgreSQL** in production (see [SPEC.md](./SPEC.md) for
the full product spec, architecture, data model, and roadmap).

---

## What Phase 1 includes

- **Auth** — email/password sign-up & login (Auth.js v5, JWT sessions, bcrypt).
- **Multi-tenancy** — every user belongs to one or more **Workspaces**; all data
  is scoped per workspace.
- **RBAC** — `OWNER / ADMIN / EDITOR / VIEWER` roles via a `Membership` join
  table, enforced server-side (`src/lib/rbac.ts`).
- **Route protection** — Edge middleware guards `/dashboard` using a DB-free
  split Auth.js config.
- **UI** — landing page, auth screens, and a dashboard, styled with a calm
  neutral + electric-indigo design system and Space Grotesk / Inter type.
- **API** — `POST /api/register`, `GET|POST /api/workspaces` (auth + tenancy
  enforced).

## Tech & why

| Concern | Choice | Rationale |
|---|---|---|
| Framework | Next.js App Router | One codebase for UI + API; server components |
| Language | TypeScript end-to-end | Type safety from DB to UI |
| DB / ORM | Prisma (SQLite local / Postgres prod) | Relational tenancy, typed queries; swap provider for prod |
| Auth | Auth.js v5 (split config) | Edge-safe middleware + Node credentials |
| Styling | Tailwind v4 + design tokens | Fast, consistent, themeable |
| Validation | zod | One schema source for API + forms |

## Getting started

```bash
# 1. Install (already done if you scaffolded with this repo)
npm install

# 2. Configure env
cp .env.example .env
#   - DATABASE_URL defaults to SQLite (file:./dev.db) — works with no setup.
#     For Postgres, set a Postgres URL and change the provider in schema.prisma.
#   - set AUTH_SECRET   (npx auth secret)

# 3. Create the schema + generate the client
npm run db:push
npm run db:generate

# 4. (optional) Seed a demo account
npm run db:seed
#   -> demo@rankpilot.app / demo1234

# 5. Run
npm run dev   # http://localhost:3000
```

## Project structure

```
prisma/schema.prisma     Multi-tenant + RBAC models (+ Auth.js tables)
prisma/seed.ts           Demo user/workspaces (incl. an EDITOR membership)
src/auth.config.ts       Edge-safe Auth.js config (used by middleware)
src/auth.ts              Node Auth.js: Prisma adapter + credentials provider
src/middleware.ts        Protects /dashboard
src/lib/prisma.ts        Singleton Prisma client
src/lib/rbac.ts          Role hierarchy + requireRole() chokepoint
src/lib/validations.ts   zod schemas (shared by API + forms)
src/app/                 Landing, (auth) login/register, dashboard, api/*
src/components/          UI kit (button, field) + feature components
```

## Roadmap

Phase 2 sites & brand voice → Phase 3 AI generation (Claude API, streaming) →
Phase 4 workflow & scheduling → Phase 5 Stripe billing → Phase 6 analytics.
Full breakdown in [SPEC.md](./SPEC.md) §9.

---

*Portfolio project demonstrating production-style full-stack SaaS architecture.*
