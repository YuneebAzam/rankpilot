import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { auth } from "@/auth";

const features = [
  {
    title: "AI content that sounds like you",
    body: "Generate blog posts, product descriptions, and meta tags from a keyword — tuned to your brand voice.",
  },
  {
    title: "Built-in SEO scoring",
    body: "Every draft comes with an on-page score and concrete fixes, so content ships ready to rank.",
  },
  {
    title: "Plan, schedule, publish",
    body: "A content calendar and workflow that takes a draft from idea to published without the spreadsheet chaos.",
  },
];

export default async function LandingPage() {
  const session = await auth();
  const isAuthed = !!session?.user;

  return (
    <main className="min-h-dvh">
      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="font-display text-xl font-bold tracking-tight">
          Rank<span className="text-[var(--color-accent)]">Pilot</span>
        </Link>
        <nav className="flex items-center gap-2">
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
        </nav>
      </header>

      {/* Hero */}
      <section className="bg-aura">
        <div className="mx-auto max-w-4xl px-6 pb-20 pt-16 text-center sm:pt-24">
          <span className="inline-flex items-center rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-1.5 text-xs font-medium text-[var(--color-ink-soft)]">
            ✨ AI content + SEO, built for small businesses
          </span>
          <h1 className="text-balance mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl">
            Rank higher without
            <br />
            hiring an agency.
          </h1>
          <p className="text-balance mx-auto mt-6 max-w-2xl text-lg text-[var(--color-ink-soft)] sm:text-xl">
            RankPilot turns a keyword into on-brand, SEO-ready content — then
            helps you schedule, publish, and track what actually moves the
            needle.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/register" variant="primary" size="lg">
              Start free — no card needed
            </ButtonLink>
            <ButtonLink href="/login" variant="secondary" size="lg">
              Log in
            </ButtonLink>
          </div>
          <p className="mt-4 text-sm text-[var(--color-muted)]">
            Free plan includes 1 site and 10 generations / month.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-6 sm:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-surface)] p-7"
            >
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-soft)]">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 py-10 text-sm text-[var(--color-muted)]">
        © {new Date().getFullYear()} RankPilot · A portfolio project demonstrating
        full-stack multi-tenant SaaS.
      </footer>
    </main>
  );
}
