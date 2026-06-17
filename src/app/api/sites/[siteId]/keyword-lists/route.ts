import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AccessError, hasAtLeast } from "@/lib/rbac";
import { getSiteWithAccess } from "@/lib/sites";
import { saveKeywordListSchema } from "@/lib/validations";

type Params = { params: Promise<{ siteId: string }> };

async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) throw new AccessError("Unauthorized", 401);
  return session.user.id;
}

// GET — keyword lists for a site (any member).
export async function GET(_req: Request, { params }: Params) {
  try {
    const userId = await requireUser();
    const { siteId } = await params;
    const access = await getSiteWithAccess(userId, siteId);
    if (!access) throw new AccessError("Not found", 404);

    const lists = await prisma.keywordList.findMany({
      where: { siteId },
      orderBy: { createdAt: "desc" },
      include: {
        keywords: {
          orderBy: { volume: "desc" },
          select: {
            id: true,
            term: true,
            volume: true,
            difficulty: true,
            intent: true,
          },
        },
      },
    });
    return NextResponse.json({ lists });
  } catch (e) {
    if (e instanceof AccessError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    throw e;
  }
}

// POST — save a keyword list with selected keywords (EDITOR or above).
export async function POST(req: Request, { params }: Params) {
  try {
    const userId = await requireUser();
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

    const parsed = saveKeywordListSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const list = await prisma.keywordList.create({
      data: {
        siteId,
        name: parsed.data.name,
        keywords: {
          create: parsed.data.keywords.map((k) => ({
            term: k.term,
            volume: k.volume ?? null,
            difficulty: k.difficulty ?? null,
            intent: k.intent ?? null,
          })),
        },
      },
      include: { keywords: true },
    });
    return NextResponse.json({ list }, { status: 201 });
  } catch (e) {
    if (e instanceof AccessError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    throw e;
  }
}
