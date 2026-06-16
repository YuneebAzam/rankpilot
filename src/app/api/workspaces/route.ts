import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createWorkspaceSchema } from "@/lib/validations";
import { slugify } from "@/lib/slug";

// GET /api/workspaces — list the workspaces the signed-in user belongs to.
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const memberships = await prisma.membership.findMany({
    where: { userId: session.user.id },
    select: {
      role: true,
      workspace: {
        select: { id: true, name: true, slug: true, plan: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const workspaces = memberships.map((m) => ({ ...m.workspace, role: m.role }));
  return NextResponse.json({ workspaces });
}

// POST /api/workspaces — create a workspace; creator becomes OWNER.
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createWorkspaceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const workspace = await prisma.workspace.create({
    data: {
      name: parsed.data.name,
      slug: `${slugify(parsed.data.name)}-${Date.now().toString(36)}`,
      memberships: {
        create: { userId: session.user.id, role: "OWNER" },
      },
    },
    select: { id: true, name: true, slug: true, plan: true },
  });

  return NextResponse.json({ workspace }, { status: 201 });
}
