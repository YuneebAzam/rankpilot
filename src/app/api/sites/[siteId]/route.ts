import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AccessError, hasAtLeast } from "@/lib/rbac";
import { getSiteWithAccess } from "@/lib/sites";
import { updateSiteSchema } from "@/lib/validations";

type Params = { params: Promise<{ siteId: string }> };

async function requireSession() {
  const session = await auth();
  if (!session?.user?.id) throw new AccessError("Unauthorized", 401);
  return session.user.id;
}

// GET — read a site (any member of its workspace).
export async function GET(_req: Request, { params }: Params) {
  try {
    const userId = await requireSession();
    const { siteId } = await params;
    const access = await getSiteWithAccess(userId, siteId);
    if (!access) throw new AccessError("Not found", 404);
    return NextResponse.json({ site: access.site, role: access.membership.role });
  } catch (e) {
    if (e instanceof AccessError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    throw e;
  }
}

// PATCH — update site / brand voice (EDITOR or above).
export async function PATCH(req: Request, { params }: Params) {
  try {
    const userId = await requireSession();
    const { siteId } = await params;
    const access = await getSiteWithAccess(userId, siteId);
    if (!access) throw new AccessError("Not found", 404);
    if (!hasAtLeast(access.membership.role, "EDITOR")) {
      throw new AccessError("Insufficient permissions", 403);
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = updateSiteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    // Normalize empty strings to null so cleared fields are stored as empty.
    const data = Object.fromEntries(
      Object.entries(parsed.data).map(([k, v]) => [k, v === "" ? null : v])
    );

    const site = await prisma.site.update({
      where: { id: siteId },
      data,
    });
    return NextResponse.json({ site });
  } catch (e) {
    if (e instanceof AccessError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    throw e;
  }
}

// DELETE — remove a site (ADMIN or above).
export async function DELETE(_req: Request, { params }: Params) {
  try {
    const userId = await requireSession();
    const { siteId } = await params;
    const access = await getSiteWithAccess(userId, siteId);
    if (!access) throw new AccessError("Not found", 404);
    if (!hasAtLeast(access.membership.role, "ADMIN")) {
      throw new AccessError("Only admins can delete sites", 403);
    }
    await prisma.site.delete({ where: { id: siteId } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof AccessError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    throw e;
  }
}
