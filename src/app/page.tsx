import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { auth } from "@/auth";

const navLinks = ["Product", "Features", "Pricing", "Docs"];

const logos = ["Brewbar", "Northwind", "Maple&Co", "Studio42", "Lumen", "Häus"];

const features = [
  {
    tag: "Create",
    title: "Publish content without the complexity",
    body: "Give RankPilot a keyword and your brand voice. It drafts blog posts, product descriptions, and meta tags in seconds — ready to edit, not start from scratch.",
    points: [
      ["Brand-aware drafts", "Tone, banned words, and CTAs applied automatically."],
      ["Streaming editor", "Watch content generate live, then refine inline."],
      ["Bulk mode", "Upload a CSV and generate hundreds at once."],
    ],
    mock: "editor",
  },
  {
    tag: "Optimize",
    title: "Instant SEO insights. Zero setup.",
    body: "Every draft ships with an on-page score and concrete fixes — keyword coverage, headings, readability, and meta length — so content is ready to rank.",
    points: [
      ["On-page scoring", "A clear 0–100 score with prioritized fixes."],
      ["Keyword intent", "Informational, commercial, or transactional — labeled."],
      ["Readability", "Flags dense copy before it ever goes live."],
    ],
    mock: "score",
  },
  {
    tag: "Scale",
    title: "Grow without the growing pains",
    body: "Manage many brands and clients from one place. Workspaces keep every tenant's content, team, and billing cleanly separated.",
    points: [
      ["Multi-workspace", "One login, every client — fully isolated."],
      ["Roles & permissions", "Owner, Admin, Editor, Viewer per workspace."],
      ["Usage metering", "Credits and limits enforced per plan."],
    ],
    mock: "workspaces",
  },
];

export default async function LandingPage() {
  const session = await auth();
  const isAuthed = !!session?.user;

  return (
    <main className="min-h-dvh overflow-x-hidden">
      {/* ===== Nav ===== */}
      <div className="bg-aurora">
        <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              Rank<span className="text-[var(--color-accent-hover)]">Pilot</span>
            </Link>
            <nav className="hidden items-center gap-6 md:flex">
              {navLinks.map((l) => (
                <span
                  key={l}
                  className="cursor-default text-sm text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-ink)]"
                >
                  {l}
                </span>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            {isAuthed ? (
              <ButtonLink href="/dashboard" variant="primary">
                Open dashboard
              </ButtonLink>
            ) : (
              <>
                <ButtonLink href="/login" variant="ghost">
                  Log in
                </ButtonLink>
                <ButtonLink href="/register" variant="primary">
                  Start free
                </ButtonLink>
              </>
            )}
          </div>
        </header>

        {/* ===== Hero ===== */}
        <section className="mx-auto max-w-4xl px-6 pb-10 pt-16 text-center sm:pt-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-line-strong)] bg-white/5 px-3 py-1 text-xs text-[var(--color-ink-soft)] backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent-hover)]" />
            New · AI brand-voice extraction
          </span>
          <h1 className="text-balance mx-auto mt-6 max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            <span className="text-gradient">Rank higher,</span> without the agency
          </h1>
          <p className="text-balance mx-auto mt-5 max-w-xl text-lg text-[var(--color-ink-soft)]">
            RankPilot turns a keyword into on-brand, SEO-ready content — then
            helps you schedule, publish, and track what actually moves the needle.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <ButtonLink href="/register" variant="primary" size="lg">
              Start free
            </ButtonLink>
            <ButtonLink href="/login" variant="secondary" size="lg">
              View demo
            </ButtonLink>
          </div>
        </section>

        {/* ===== Hero product mockup ===== */}
        <div className="mx-auto max-w-5xl px-6 pb-20">
          <BrowserMock />
        </div>
      </div>

      {/* ===== Logo strip ===== */}
      <section className="border-y border-[var(--color-line)] bg-[var(--color-surface)]/40">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-6 py-7">
          <span className="text-xs uppercase tracking-widest text-[var(--color-muted)]">
            Trusted by lean teams
          </span>
          {logos.map((l) => (
            <span
              key={l}
              className="text-base font-semibold tracking-tight text-[var(--color-muted)]"
            >
              {l}
            </span>
          ))}
        </div>
      </section>

      {/* ===== Feature sections ===== */}
      <div className="mx-auto max-w-6xl space-y-28 px-6 py-28">
        {features.map((f, i) => (
          <section
            key={f.title}
            className={`grid items-center gap-12 lg:grid-cols-2 ${
              i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
            }`}
          >
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent-hover)]">
                {f.tag}
              </span>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                {f.title}
              </h2>
              <p className="mt-4 text-[var(--color-ink-soft)]">{f.body}</p>
              <ul className="mt-8 space-y-5">
                {f.points.map(([h, d]) => (
                  <li key={h} className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent-hover)]" />
                    <div>
                      <p className="text-sm font-medium">{h}</p>
                      <p className="text-sm text-[var(--color-ink-soft)]">{d}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <FeatureMock kind={f.mock} />
          </section>
        ))}
      </div>

      {/* ===== Stats ===== */}
      <section className="border-y border-[var(--color-line)] bg-[var(--color-surface)]/40">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            2.4M+ words generated{" "}
            <span className="text-[var(--color-muted)]">(and counting)</span>
          </h2>
          <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-[var(--color-line)] bg-[var(--color-line)] sm:grid-cols-4">
            {[
              ["Businesses", "12,480"],
              ["Sites tracked", "31,902"],
              ["Pieces published", "846,123"],
              ["Keywords ranked", "208,447"],
            ].map(([label, value]) => (
              <div key={label} className="bg-[var(--color-canvas)] px-6 py-8">
                <div className="font-mono text-2xl font-semibold tracking-tight sm:text-3xl">
                  {value}
                </div>
                <div className="mt-2 text-xs uppercase tracking-widest text-[var(--color-muted)]">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Testimonials ===== */}
      <section className="mx-auto max-w-6xl px-6 py-28">
        <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
          Loved by founders and marketers
        </h2>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            [
              "We replaced a $2k/mo content retainer in a week. The SEO scoring alone is worth it.",
              "Priya N.",
              "Founder, Brewbar",
            ],
            [
              "I run content for six clients from one dashboard. Workspaces keep everything clean.",
              "Marcus L.",
              "Freelance marketer",
            ],
            [
              "Product descriptions for 300 SKUs in an afternoon, all on-brand. Wild.",
              "Dana K.",
              "Head of Ecom, Maple&Co",
            ],
          ].map(([quote, name, role]) => (
            <figure key={name} className="panel p-6">
              <blockquote className="text-sm leading-relaxed text-[var(--color-ink)]">
                “{quote}”
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--color-accent-soft)] text-sm font-semibold text-[var(--color-accent-hover)]">
                  {name.charAt(0)}
                </span>
                <span className="text-sm">
                  <span className="block font-medium">{name}</span>
                  <span className="block text-[var(--color-muted)]">{role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="mx-auto max-w-6xl px-6 pb-28">
        <div className="relative overflow-hidden rounded-3xl border border-[var(--color-line-strong)] px-6 py-20 text-center">
          <div className="bg-aurora absolute inset-0 -z-10 opacity-90" />
          <h2 className="text-balance mx-auto max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Your best content is ready for takeoff
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[var(--color-ink-soft)]">
            Start free — no card needed. 1 site and 10 generations a month, on us.
          </p>
          <div className="mt-8">
            <ButtonLink href="/register" variant="primary" size="lg">
              Start free
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="border-t border-[var(--color-line)]">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <span className="text-lg font-semibold tracking-tight">
              Rank<span className="text-[var(--color-accent-hover)]">Pilot</span>
            </span>
            <p className="mt-3 max-w-xs text-sm text-[var(--color-ink-soft)]">
              AI content & SEO for small businesses and the freelancers who serve
              them.
            </p>
          </div>
          {[
            ["Product", ["Features", "Pricing", "Changelog", "Roadmap"]],
            ["Company", ["About", "Blog", "Careers", "Contact"]],
            ["Resources", ["Docs", "Guides", "Support", "Status"]],
          ].map(([title, items]) => (
            <div key={title as string}>
              <h3 className="text-sm font-medium">{title}</h3>
              <ul className="mt-4 space-y-2.5">
                {(items as string[]).map((it) => (
                  <li
                    key={it}
                    className="cursor-default text-sm text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-ink)]"
                  >
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-[var(--color-line)]">
          <div className="mx-auto max-w-6xl px-6 py-6 text-xs text-[var(--color-muted)]">
            © {new Date().getFullYear()} RankPilot · A portfolio project
            demonstrating full-stack multi-tenant SaaS.
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ---------- Mock UI building blocks (pure CSS, no images) ---------- */

function BrowserMock() {
  return (
    <div className="panel overflow-hidden shadow-2xl shadow-black/40">
      <div className="flex items-center gap-2 border-b border-[var(--color-line)] px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-4 rounded-md bg-white/5 px-3 py-1 text-xs text-[var(--color-muted)]">
          app.rankpilot.io/generate
        </span>
      </div>
      <div className="grid gap-4 p-5 sm:grid-cols-[200px_1fr]">
        <aside className="hidden space-y-1.5 sm:block">
          {["Dashboard", "Content", "Keywords", "Calendar", "Analytics"].map(
            (x, i) => (
              <div
                key={x}
                className={`rounded-md px-3 py-2 text-sm ${
                  i === 1
                    ? "bg-[var(--color-accent-soft)] text-[var(--color-ink)]"
                    : "text-[var(--color-ink-soft)]"
                }`}
              >
                {x}
              </div>
            )
          )}
        </aside>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-3 w-40 rounded bg-white/10" />
            <div className="rounded-md bg-[var(--color-accent)] px-3 py-1.5 text-xs font-medium text-white">
              Generate
            </div>
          </div>
          <div className="panel space-y-2.5 p-4">
            <div className="h-3 w-3/4 rounded bg-white/15" />
            <div className="h-2.5 w-full rounded bg-white/8" />
            <div className="h-2.5 w-11/12 rounded bg-white/8" />
            <div className="h-2.5 w-2/3 rounded bg-white/8" />
            <div className="flex gap-2 pt-2">
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] text-emerald-300">
                SEO 92
              </span>
              <span className="rounded-full bg-sky-500/15 px-2 py-0.5 text-[11px] text-sky-300">
                Readability A
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureMock({ kind }: { kind: string }) {
  if (kind === "score") {
    return (
      <div className="panel p-6">
        <div className="flex items-center justify-between">
          <div className="h-3 w-28 rounded bg-white/10" />
          <span className="font-mono text-3xl font-semibold text-emerald-400">
            92
          </span>
        </div>
        <div className="mt-6 space-y-4">
          {[
            ["Keyword coverage", 90, "bg-emerald-400"],
            ["Headings", 80, "bg-sky-400"],
            ["Readability", 95, "bg-emerald-400"],
            ["Meta length", 60, "bg-amber-400"],
          ].map(([label, pct, color]) => (
            <div key={label as string}>
              <div className="mb-1.5 flex justify-between text-xs text-[var(--color-ink-soft)]">
                <span>{label}</span>
                <span>{pct}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/8">
                <div
                  className={`h-2 rounded-full ${color}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (kind === "workspaces") {
    return (
      <div className="panel space-y-3 p-6">
        {[
          ["Brewbar", "OWNER", "bg-[var(--color-accent)]"],
          ["Maple&Co", "EDITOR", "bg-emerald-500"],
          ["Studio42", "ADMIN", "bg-amber-500"],
        ].map(([name, role, color]) => (
          <div
            key={name as string}
            className="flex items-center justify-between rounded-lg border border-[var(--color-line)] bg-white/[0.02] px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-8 w-8 place-items-center rounded-md bg-white/10 text-xs font-semibold">
                {(name as string).charAt(0)}
              </span>
              <span className="text-sm">{name}</span>
            </div>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium text-white ${color}`}
            >
              {role}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // default: editor
  return (
    <div className="panel p-6">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-accent-hover)]" />
        <div className="h-3 w-32 rounded bg-white/10" />
      </div>
      <div className="mt-5 space-y-2.5">
        <div className="h-3 w-5/6 rounded bg-white/15" />
        <div className="h-2.5 w-full rounded bg-white/8" />
        <div className="h-2.5 w-full rounded bg-white/8" />
        <div className="h-2.5 w-3/4 rounded bg-white/8" />
        <div className="h-2.5 w-full rounded bg-white/8" />
        <div className="h-2.5 w-2/3 rounded bg-white/8" />
      </div>
      <div className="mt-5 flex gap-2">
        <span className="rounded-md bg-[var(--color-accent)] px-3 py-1.5 text-xs font-medium text-white">
          Generate
        </span>
        <span className="rounded-md border border-[var(--color-line-strong)] px-3 py-1.5 text-xs text-[var(--color-ink-soft)]">
          Refine
        </span>
      </div>
    </div>
  );
}
