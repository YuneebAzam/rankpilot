import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CreateWorkspaceForm } from "@/components/create-workspace-form";

const roleStyles: Record<string, string> = {
  OWNER: "bg-[var(--color-accent-soft)] text-[var(--color-accent)]",
  ADMIN: "bg-amber-50 text-amber-700",
  EDITOR: "bg-emerald-50 text-emerald-700",
  VIEWER: "bg-gray-100 text-gray-600",
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
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Your workspaces
        </h1>
        <p className="mt-1 text-[var(--color-ink-soft)]">
          Each workspace is an isolated tenant with its own sites, content, and
          team. Your role controls what you can do.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {memberships.map(({ role, workspace }) => (
          <div
            key={workspace.id}
            className="rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-surface)] p-6"
          >
            <div className="flex items-start justify-between">
              <h2 className="font-display text-lg font-semibold">
                {workspace.name}
              </h2>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
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
          </div>
        ))}
      </div>

      <div className="rounded-[var(--radius-card)] border border-dashed border-[var(--color-line)] bg-[var(--color-surface)] p-6">
        <h3 className="font-display text-base font-semibold">
          Create a new workspace
        </h3>
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
