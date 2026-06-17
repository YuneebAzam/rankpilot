import Link from "next/link";
import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getMembership, hasAtLeast } from "@/lib/rbac";
import { AddSiteForm } from "@/components/add-site-form";

export default async function WorkspaceDetailPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const session = await auth();
  const userId = session!.user.id;
  const { workspaceId } = await params;

  // Tenancy guard: must be a member of this workspace.
  const membership = await getMembership(userId, workspaceId);
  if (!membership) notFound();

  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    select: {
      name: true,
      plan: true,
      sites: {
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, url: true, industry: true },
      },
    },
  });
  if (!workspace) notFound();

  const canEdit = hasAtLeast(membership.role, "EDITOR");

  return (
    <div className="space-y-10">
      <div>
        <Link
          href="/dashboard"
          className="text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)]"
        >
          ← All workspaces
        </Link>
        <div className="mt-3 flex items-center gap-3">
          <h1 className="text-3xl font-semibold tracking-tight">
            {workspace.name}
          </h1>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-[var(--color-ink-soft)]">
            {membership.role}
          </span>
        </div>
        <p className="mt-1 text-[var(--color-ink-soft)]">
          Sites in this workspace. Each site has its own brand voice that powers
          AI content generation.
        </p>
      </div>

      {/* Sites list */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {workspace.sites.map((site) => (
          <Link
            key={site.id}
            href={`/dashboard/sites/${site.id}`}
            className="panel block p-5 transition-colors hover:border-[var(--color-line-strong)]"
          >
            <h2 className="font-medium">{site.name}</h2>
            <p className="mt-1 truncate text-sm text-[var(--color-accent-hover)]">
              {site.url}
            </p>
            {site.industry ? (
              <p className="mt-2 text-xs text-[var(--color-muted)]">
                {site.industry}
              </p>
            ) : null}
          </Link>
        ))}
        {workspace.sites.length === 0 ? (
          <p className="text-sm text-[var(--color-muted)]">
            No sites yet{canEdit ? " — add your first one below." : "."}
          </p>
        ) : null}
      </div>

      {/* Add site */}
      {canEdit ? (
        <div className="panel max-w-2xl p-6">
          <h3 className="text-base font-medium">Add a site</h3>
          <p className="mb-4 mt-1 text-sm text-[var(--color-ink-soft)]">
            You can refine its brand voice after creating it.
          </p>
          <AddSiteForm workspaceId={workspaceId} />
        </div>
      ) : (
        <p className="text-sm text-[var(--color-muted)]">
          Your role ({membership.role}) is read-only in this workspace.
        </p>
      )}
    </div>
  );
}
