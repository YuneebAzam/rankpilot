import Link from "next/link";
import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasAtLeast } from "@/lib/rbac";
import { getSiteWithAccess } from "@/lib/sites";
import { BrandVoiceForm } from "@/components/brand-voice-form";
import { KeywordResearch } from "@/components/keyword-research";

const intentStyles: Record<string, string> = {
  informational: "bg-sky-500/15 text-sky-300",
  commercial: "bg-amber-500/15 text-amber-300",
  transactional: "bg-emerald-500/15 text-emerald-300",
};

export default async function SiteDetailPage({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const session = await auth();
  const userId = session!.user.id;
  const { siteId } = await params;

  const access = await getSiteWithAccess(userId, siteId);
  if (!access?.site) notFound();

  const { site, membership } = access;
  const canEdit = hasAtLeast(membership.role, "EDITOR");

  const keywordLists = await prisma.keywordList.findMany({
    where: { siteId: site.id },
    orderBy: { createdAt: "desc" },
    include: {
      keywords: {
        orderBy: { volume: "desc" },
        select: { id: true, term: true, volume: true, difficulty: true, intent: true },
      },
    },
  });

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <Link
          href={`/dashboard/workspaces/${site.workspaceId}`}
          className="text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)]"
        >
          ← Back to workspace
        </Link>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          {site.name}
        </h1>
        <a
          href={site.url}
          target="_blank"
          rel="noreferrer"
          className="mt-1 inline-block text-sm text-[var(--color-accent-hover)] hover:underline"
        >
          {site.url} ↗
        </a>
      </div>

      <div className="panel p-6">
        <h2 className="text-lg font-semibold">Brand voice</h2>
        <p className="mb-6 mt-1 text-sm text-[var(--color-ink-soft)]">
          This profile is injected into every AI generation so content stays
          on-brand. (Used in Phase 3.)
        </p>
        <BrandVoiceForm
          siteId={site.id}
          canEdit={canEdit}
          initial={{
            name: site.name ?? "",
            url: site.url ?? "",
            industry: site.industry ?? "",
            audience: site.audience ?? "",
            tone: site.tone ?? "",
            guidelines: site.guidelines ?? "",
            bannedWords: site.bannedWords ?? "",
            preferredCta: site.preferredCta ?? "",
          }}
        />
      </div>

      {/* Keyword research */}
      <div className="panel p-6">
        <h2 className="text-lg font-semibold">Keywords</h2>
        <p className="mb-6 mt-1 text-sm text-[var(--color-ink-soft)]">
          Research target keywords and save them into lists. These become the
          topics RankPilot generates content for. (Used in Phase 3.)
        </p>

        <KeywordResearch siteId={site.id} canEdit={canEdit} />

        {keywordLists.length > 0 ? (
          <div className="mt-8 space-y-5">
            <h3 className="text-sm font-medium text-[var(--color-ink-soft)]">
              Saved lists
            </h3>
            {keywordLists.map((list) => (
              <div
                key={list.id}
                className="rounded-xl border border-[var(--color-line)] p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-medium">{list.name}</span>
                  <span className="text-xs text-[var(--color-muted)]">
                    {list.keywords.length} keyword
                    {list.keywords.length === 1 ? "" : "s"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {list.keywords.map((k) => (
                    <span
                      key={k.id}
                      className="inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-white/[0.02] px-3 py-1 text-xs"
                    >
                      {k.term}
                      {k.intent ? (
                        <span
                          className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                            intentStyles[k.intent] ?? ""
                          }`}
                        >
                          {k.intent}
                        </span>
                      ) : null}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
