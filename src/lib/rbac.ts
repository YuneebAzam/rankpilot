import { prisma } from "@/lib/prisma";

// Role is a string in the DB (SQLite has no enums); this union is the source of
// truth in app code. On PostgreSQL this maps cleanly to a native enum.
export type Role = "OWNER" | "ADMIN" | "EDITOR" | "VIEWER";

// Role hierarchy: higher number = more privileges.
const RANK: Record<Role, number> = {
  VIEWER: 1,
  EDITOR: 2,
  ADMIN: 3,
  OWNER: 4,
};

export function hasAtLeast(role: Role, minimum: Role): boolean {
  return RANK[role] >= RANK[minimum];
}

export type MembershipContext = {
  workspaceId: string;
  role: Role;
};

/**
 * Resolve a user's membership in a workspace. Returns null if the user is not a
 * member — callers MUST treat null as "no access" (404/403), never leak data.
 *
 * This is the single chokepoint for multi-tenancy: every workspace-scoped query
 * should run only after this check passes.
 */
export async function getMembership(
  userId: string,
  workspaceId: string
): Promise<MembershipContext | null> {
  const membership = await prisma.membership.findUnique({
    where: { userId_workspaceId: { userId, workspaceId } },
    select: { workspaceId: true, role: true },
  });
  // role is stored as a string; narrow to the Role union.
  return membership as MembershipContext | null;
}

/**
 * Assert a user has at least `minimum` role in a workspace.
 * Throws an AccessError that route handlers convert to a 403.
 */
export async function requireRole(
  userId: string,
  workspaceId: string,
  minimum: Role
): Promise<MembershipContext> {
  const ctx = await getMembership(userId, workspaceId);
  if (!ctx) throw new AccessError("Not a member of this workspace", 404);
  if (!hasAtLeast(ctx.role, minimum)) {
    throw new AccessError("Insufficient permissions", 403);
  }
  return ctx;
}

export class AccessError extends Error {
  status: number;
  constructor(message: string, status = 403) {
    super(message);
    this.name = "AccessError";
    this.status = status;
  }
}
