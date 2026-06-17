import Link from "next/link";
import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { hasAtLeast } from "@/lib/rbac";
import { getSiteWithAccess } from "@/lib/sites";
import { BrandVoiceForm } from "@/components/brand-voice-form";

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
    </div>
  );
}
