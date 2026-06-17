import { prisma } from "@/lib/prisma";
import { getMembership, type MembershipContext } from "@/lib/rbac";

/**
 * Load a site together with the requesting user's role in its workspace.
 * Returns null if the site doesn't exist OR the user isn't a member of its
 * workspace — callers treat null as 404 (never leak cross-tenant existence).
 */
export async function getSiteWithAccess(userId: string, siteId: string) {
  const site = await prisma.site.findUnique({ where: { id: siteId } });
  if (!site) return null;

  const membership = await getMembership(userId, site.workspaceId);
  if (!membership) return null;

  return { site, membership };
}

export type SiteAccess = {
  site: Awaited<ReturnType<typeof prisma.site.findUnique>>;
  membership: MembershipContext;
};
