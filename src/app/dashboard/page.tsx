import Link from "next/link";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CreateWorkspaceForm } from "@/components/create-workspace-form";

const roleStyles: Record<string, string> = {
  OWNER: "bg-[var(--color-accent)] text-white",
  ADMIN: "bg-amber-500 text-white",
  EDITOR: "bg-emerald-500 text-white",
  VIEWER: "bg-white/10 text-[var(--color-ink-soft)]",
};

export default async function DashboardHome() {
  const session = await auth();
  const userId = session!.user.id;

  // Multi-tenant read: only workspaces the user is a member of.
  const memberships = await prisma.membership.findMany({
    where: { userId },
    select: {
      role: true,
      workspace: {
        select: {
          id: true,
          name: true,
          plan: true,
          _count: { select: { memberships: true } },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Your workspaces</h1>
        <p className="mt-1 text-[var(--color-ink-soft)]">
          Each workspace is an isolated tenant with its own sites, content, and
          team. Your role controls what you can do.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {memberships.map(({ role, workspace }) => (
          <Link
            key={workspace.id}
            href={`/dashboard/workspaces/${workspace.id}`}
            className="panel block p-6 transition-colors hover:border-[var(--color-line-strong)]"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-semibold">{workspace.name}</h2>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                  roleStyles[role] ?? roleStyles.VIEWER
                }`}
              >
                {role}
              </span>
            </div>
            <dl className="mt-4 flex gap-6 text-sm text-[var(--color-ink-soft)]">
              <div>
                <dt className="text-[var(--color-muted)]">Plan</dt>
                <dd className="font-medium text-[var(--color-ink)]">
                  {workspace.plan}
                </dd>
              </div>
              <div>
                <dt className="text-[var(--color-muted)]">Members</dt>
                <dd className="font-medium text-[var(--color-ink)]">
                  {workspace._count.memberships}
                </dd>
              </div>
            </dl>
          </Link>
        ))}
      </div>

      <div className="rounded-[var(--radius-card)] border border-dashed border-[var(--color-line-strong)] bg-[var(--color-surface)]/40 p-6">
        <h3 className="text-base font-medium">Create a new workspace</h3>
        <p className="mb-4 mt-1 text-sm text-[var(--color-ink-soft)]">
          Great for managing a separate client or brand. You&apos;ll be the
          owner.
        </p>
        <CreateWorkspaceForm />
      </div>

      <p className="text-sm text-[var(--color-muted)]">
        Next up (Phase 2): add a Site to a workspace and define its brand voice.
      </p>
    </div>
  );
}
