import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AccessError, getMembership, hasAtLeast } from "@/lib/rbac";
import { createSiteSchema } from "@/lib/validations";

type Params = { params: Promise<{ workspaceId: string }> };

// GET — list sites in a workspace (any member).
export async function GET(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { workspaceId } = await params;

  const membership = await getMembership(session.user.id, workspaceId);
  if (!membership) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const sites = await prisma.site.findMany({
    where: { workspaceId },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, url: true, industry: true, createdAt: true },
  });
  return NextResponse.json({ sites });
}

// POST — create a site (EDITOR or above).
export async function POST(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { workspaceId } = await params;

  try {
    const membership = await getMembership(session.user.id, workspaceId);
    if (!membership) throw new AccessError("Not found", 404);
    if (!hasAtLeast(membership.role, "EDITOR")) {
      throw new AccessError("Insufficient permissions", 403);
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = createSiteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const site = await prisma.site.create({
      data: {
        workspaceId,
        name: parsed.data.name,
        url: parsed.data.url,
        industry: parsed.data.industry || null,
        audience: parsed.data.audience || null,
      },
      select: { id: true, name: true, url: true },
    });
    return NextResponse.json({ site }, { status: 201 });
  } catch (e) {
    if (e instanceof AccessError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    throw e;
  }
}
