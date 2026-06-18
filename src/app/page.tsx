import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { auth } from "@/auth";

const navLinks = ["Product", "Solutions", "Pricing", "Docs", "Blog"];
const logos = ["Brewbar", "Northwind", "Maple&Co", "Studio42", "Lumen", "Häus"];
const stars = [
  [12, 8], [22, 18], [34, 6], [48, 14], [62, 9], [75, 17], [85, 7], [91, 20],
];

export default async function LandingPage() {
  const session = await auth();
  const isAuthed = !!session?.user;

  return (
    <main className="min-h-dvh overflow-x-hidden">
      {/* ===== HERO ===== */}
      <section className="dusk-sky relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          {stars.map(([l, t], i) => (
            <span key={i} className="star" style={{ left: `${l}%`, top: `${t}%` }} />
          ))}
        </div>

        {/* mountain silhouette */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0">
          <svg viewBox="0 0 1440 220" preserveAspectRatio="none" className="h-[220px] w-full">
            <path d="M0,220 L0,140 L150,95 L300,150 L450,85 L620,160 L780,100 L940,165 L1100,95 L1280,155 L1440,110 L1440,220 Z" fill="#08080c" opacity="0.7" />
            <path d="M0,220 L0,175 L200,135 L400,178 L600,125 L820,180 L1040,135 L1260,180 L1440,140 L1440,220 Z" fill="#08080c" />
          </svg>
        </div>

        {/* nav */}
        <header className="relative z-10">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2 text-[15px] font-semibold">
                <span className="grid h-6 w-6 place-items-center rounded-md bg-white text-[#08080c]">R</span>
                RankPilot
              </Link>
              <nav className="hidden items-center gap-6 text-sm text-[var(--color-ink-soft)] md:flex">
                {navLinks.map((l) => (
                  <span key={l} className="cursor-default hover:text-white">{l}</span>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-3 text-sm">
              {isAuthed ? (
                <ButtonLink href="/dashboard" variant="secondary">Dashboard</ButtonLink>
              ) : (
                <>
                  <Link href="/login" className="text-[var(--color-ink-soft)] hover:text-white">Log in</Link>
                  <ButtonLink href="/register" variant="secondary">Start free</ButtonLink>
                </>
              )}
            </div>
          </div>
        </header>

        {/* hero copy */}
        <div className="relative z-10 mx-auto max-w-3xl px-6 pb-6 pt-16 text-center sm:pt-20">
          <h1 className="mx-auto max-w-2xl text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
            Ship content peacefully
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[15px] text-white/80">
            RankPilot is the calmest way to research, write, and publish SEO content —
            for small teams who&apos;d rather grow than wrestle tools.
          </p>
          <div className="mt-7 inline-flex items-center gap-1 rounded-xl border border-[var(--color-line)] bg-black/30 p-1">
            <ButtonLink href="/register" variant="primary">Start free</ButtonLink>
            <Link href="/login" className="rounded-lg px-5 py-2 text-sm font-medium text-white/80 hover:text-white">
              View demo
            </Link>
          </div>
        </div>

        {/* product card */}
        <div className="relative z-10 mx-auto max-w-4xl px-6 pb-12">
          <BrowserMock />
        </div>
      </section>

      {/* panoramic band */}
      <div className="panorama h-8 w-full" />

      {/* ===== LOGO STRIP ===== */}
      <section className="border-b border-[var(--color-line)] bg-[var(--color-surface)]/40">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-12 gap-y-3 px-6 py-7">
          <span className="text-xs uppercase tracking-widest text-[var(--color-muted)]">
            Trusted by lean teams
          </span>
          {logos.map((l) => (
            <span key={l} className="text-base font-semibold text-[var(--color-muted)]">{l}</span>
          ))}
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <div className="mx-auto max-w-5xl space-y-28 px-6 py-28">
        <section className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent-hover)]">Create</span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Publish content<br />without the complexity
            </h2>
            <p className="mt-4 max-w-md text-[var(--color-ink-soft)]">
              Give RankPilot a keyword and your brand voice. It drafts blog posts,
              product descriptions, and meta tags in seconds — ready to edit, not
              start from scratch.
            </p>
            <span className="mt-5 inline-block cursor-default text-sm text-[var(--color-accent-hover)]">Learn more →</span>
            <div className="mt-10 grid grid-cols-3 gap-6">
              {[
                ["Brand-aware", "Tone & rules applied automatically."],
                ["Streaming editor", "Watch it write, refine inline."],
                ["Bulk mode", "Hundreds from a CSV."],
              ].map(([h, d]) => (
                <div key={h}>
                  <div className="h-5 w-5 rounded bg-[var(--color-accent-soft)]" />
                  <p className="mt-3 text-sm font-medium">{h}</p>
                  <p className="text-xs text-[var(--color-muted)]">{d}</p>
                </div>
              ))}
            </div>
          </div>
          <EditorMock />
        </section>

        <section className="grid items-center gap-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1"><ScoreMock /></div>
          <div className="order-1 lg:order-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent-hover)]">Optimize</span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Instant SEO insights.<br />Zero setup.
            </h2>
            <p className="mt-4 max-w-md text-[var(--color-ink-soft)]">
              Every draft ships with an on-page score and concrete fixes — keyword
              coverage, headings, readability, and meta length — so content is ready
              to rank.
            </p>
            <span className="mt-5 inline-block cursor-default text-sm text-[var(--color-accent-hover)]">Learn more →</span>
          </div>
        </section>

        <section className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent-hover)]">Scale</span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Grow big<br />without the growing pains
            </h2>
            <p className="mt-4 max-w-md text-[var(--color-ink-soft)]">
              Manage many brands and clients from one place. Workspaces keep every
              tenant&apos;s content, team, and billing cleanly separated.
            </p>
            <span className="mt-5 inline-block cursor-default text-sm text-[var(--color-accent-hover)]">Learn more →</span>
          </div>
          <WorkspacesMock />
        </section>
      </div>

      {/* ===== ANALYTICS (tinted) ===== */}
      <section
        className="border-y border-[var(--color-line)]"
        style={{ background: "radial-gradient(80% 120% at 50% 0%, rgba(16,185,129,.10), transparent 60%), #0d0f12" }}
      >
        <div className="mx-auto max-w-5xl px-6 py-24 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-300">Analytics</span>
          <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Ranks, traffic, and alerts in one place. Clarity without the chaos.
          </h2>
          <div className="panel mx-auto mt-12 max-w-3xl p-5 text-left">
            <div className="mb-4 flex items-center justify-between">
              <div className="h-3 w-32 rounded bg-white/10" />
              <div className="flex gap-2">
                <span className="rounded bg-white/5 px-2 py-1 text-xs text-[var(--color-muted)]">7d</span>
                <span className="rounded bg-white/10 px-2 py-1 text-xs text-white">30d</span>
              </div>
            </div>
            <div className="flex h-48 items-end gap-2">
              {[35, 50, 42, 62, 55, 74, 88].map((h, i) => (
                <div key={i} className="w-full rounded-t bg-emerald-500/50" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section style={{ background: "radial-gradient(70% 100% at 50% 0%, rgba(120,30,60,.5), transparent 60%), #08080c" }}>
        <div className="mx-auto max-w-5xl px-6 py-24">
          <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
            Trusted by the best in business
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              ["Brewbar", "We replaced a $2k/mo content retainer in a week. The SEO scoring alone is worth it.", "Priya N. · Founder"],
              ["Maple&Co", "Product descriptions for 300 SKUs in an afternoon, all on-brand. Wild.", "Dana K. · Head of Ecom"],
              ["Studio42", "I run content for six clients from one dashboard. Workspaces keep it clean.", "Marcus L. · Freelancer"],
            ].map(([brand, quote, who]) => (
              <figure key={brand} className="panel p-6">
                <div className="mb-4 text-lg font-bold tracking-tight">{brand}</div>
                <blockquote className="text-sm leading-relaxed">“{quote}”</blockquote>
                <figcaption className="mt-5 text-sm text-[var(--color-muted)]">{who}</figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-14 text-center text-lg text-[var(--color-ink-soft)]">…and loved by marketers</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Finally an AI tool that sounds like us.", "Sam R."],
              ["Cut our publishing time in half.", "Lena T."],
              ["The keyword scoring is shockingly good.", "Omar D."],
              ["Onboarded my whole team in a day.", "Aria P."],
            ].map(([q, w]) => (
              <div key={w} className="panel p-4 text-xs text-[var(--color-ink-soft)]">
                “{q}”<span className="mt-2 block text-[var(--color-muted)]">— {w}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS (LED) ===== */}
      <section className="led border-y border-[var(--color-line)]">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            2.4M+ words generated per month{" "}
            <span className="text-[var(--color-muted)]">(and counting)</span>
          </h2>
          <div className="mx-auto mt-12 space-y-3 font-mono text-2xl font-bold tracking-[0.25em] sm:text-3xl">
            {[
              ["BUSINESSES", "12,480"],
              ["SITES", "31,902"],
              ["GENERATIONS", "846,123"],
              ["REQUESTS", "146,920,851"],
              ["KEYWORDS", "208,447"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between border-b border-[var(--color-line)] pb-3">
                <span className="text-xs tracking-widest text-[var(--color-muted)]">{label}</span>
                <span className="text-[#e6e0cf]">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="cta-glow relative overflow-hidden rounded-3xl border border-[var(--color-line-strong)] px-6 py-20 text-center">
            <h2 className="mx-auto max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Your best content is now boarding
            </h2>
            <p className="mx-auto mt-3 max-w-md text-white/80">
              Start free — no card needed. 1 site and 10 generations a month, on us.
            </p>
            <div className="mt-8">
              <Link href="/register" className="inline-block rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[#08080c] hover:bg-white/90">
                Start free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-[var(--color-line)]">
        <div className="mx-auto grid max-w-5xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <span className="flex items-center gap-2 text-[15px] font-semibold">
              <span className="grid h-6 w-6 place-items-center rounded-md bg-white text-[#08080c]">R</span>
              RankPilot
            </span>
            <p className="mt-3 max-w-xs text-sm text-[var(--color-ink-soft)]">
              AI content &amp; SEO for small businesses and the freelancers who serve them.
            </p>
          </div>
          {[
            ["Product", ["Features", "Pricing", "Changelog", "Roadmap"]],
            ["Company", ["About", "Blog", "Careers", "Contact"]],
            ["Resources", ["Docs", "Guides", "Support", "Status"]],
          ].map(([title, items]) => (
            <div key={title as string}>
              <h3 className="text-sm font-medium">{title}</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-[var(--color-ink-soft)]">
                {(items as string[]).map((it) => (
                  <li key={it} className="cursor-default hover:text-white">{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-[var(--color-line)]">
          <div className="mx-auto max-w-5xl px-6 py-6 text-xs text-[var(--color-muted)]">
            © {new Date().getFullYear()} RankPilot · A portfolio project demonstrating full-stack multi-tenant SaaS.
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ---------- CSS mock UI ---------- */

function BrowserMock() {
  return (
    <div className="panel overflow-hidden shadow-2xl shadow-black/50">
      <div className="flex items-center gap-2 border-b border-[var(--color-line)] px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-4 rounded-md bg-white/5 px-3 py-1 text-xs text-[var(--color-muted)]">app.rankpilot.io</span>
      </div>
      <div className="grid grid-cols-[180px_1fr] gap-4 p-4">
        <aside className="space-y-1">
          <div className="rounded-md bg-[var(--color-accent-soft)] px-3 py-2 text-xs text-white">Content</div>
          {["Keywords", "Calendar", "Analytics"].map((x) => (
            <div key={x} className="px-3 py-2 text-xs text-[var(--color-ink-soft)]">{x}</div>
          ))}
        </aside>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-3 w-40 rounded bg-white/10" />
            <div className="rounded-md bg-[var(--color-accent)] px-3 py-1.5 text-xs font-medium text-white">Generate</div>
          </div>
          <div className="panel space-y-2 p-4">
            <div className="h-3 w-3/4 rounded bg-white/15" />
            <div className="h-2.5 w-full rounded bg-white/[0.08]" />
            <div className="h-2.5 w-11/12 rounded bg-white/[0.08]" />
            <div className="h-2.5 w-2/3 rounded bg-white/[0.08]" />
            <div className="flex gap-2 pt-1">
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] text-emerald-300">SEO 92</span>
              <span className="rounded-full bg-sky-500/15 px-2 py-0.5 text-[11px] text-sky-300">Readability A</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditorMock() {
  return (
    <div className="panel p-6">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-accent-hover)]" />
        <div className="h-3 w-28 rounded bg-white/10" />
      </div>
      <div className="mt-5 space-y-2.5">
        <div className="h-3 w-5/6 rounded bg-white/15" />
        {["w-full", "w-full", "w-3/4", "w-full", "w-2/3"].map((w, i) => (
          <div key={i} className={`h-2.5 ${w} rounded bg-white/[0.08]`} />
        ))}
      </div>
      <div className="mt-5 flex gap-2">
        <span className="rounded-md bg-[var(--color-accent)] px-3 py-1.5 text-xs font-medium text-white">Generate</span>
        <span className="rounded-md border border-[var(--color-line-strong)] px-3 py-1.5 text-xs text-[var(--color-ink-soft)]">Refine</span>
      </div>
    </div>
  );
}

function ScoreMock() {
  return (
    <div className="panel p-6">
      <div className="flex items-center justify-between">
        <div className="h-3 w-28 rounded bg-white/10" />
        <span className="font-mono text-3xl font-bold text-emerald-400">92</span>
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
              <span>{label}</span><span>{pct}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/[0.08]">
              <div className={`h-2 rounded-full ${color}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkspacesMock() {
  return (
    <div className="panel space-y-3 p-6">
      {[
        ["Brewbar", "OWNER", "bg-[var(--color-accent)]"],
        ["Maple&Co", "EDITOR", "bg-emerald-500"],
        ["Studio42", "ADMIN", "bg-amber-500"],
      ].map(([name, role, color]) => (
        <div key={name as string} className="flex items-center justify-between rounded-lg border border-[var(--color-line)] bg-white/[0.02] px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-white/10 text-xs font-semibold">
              {(name as string).charAt(0)}
            </span>
            <span className="text-sm">{name}</span>
          </div>
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium text-white ${color}`}>{role}</span>
        </div>
      ))}
    </div>
  );
}
