import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import { slugify } from "@/lib/slug";

/**
 * Sign up: creates a User, then a personal Workspace, and an OWNER Membership —
 * all in one transaction so a new user always lands in a usable workspace.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists" },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.$transaction(async (tx) => {
    const created = await tx.user.create({
      data: { name, email, passwordHash },
    });

    const workspaceName = `${name.split(" ")[0]}'s Workspace`;
    await tx.workspace.create({
      data: {
        name: workspaceName,
        slug: await uniqueSlug(tx, slugify(workspaceName)),
        memberships: {
          create: { userId: created.id, role: "OWNER" },
        },
      },
    });

    return created;
  });

  return NextResponse.json(
    { id: user.id, email: user.email },
    { status: 201 }
  );
}

// Ensure workspace slug uniqueness with a numeric suffix if needed.
async function uniqueSlug(
  tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
  base: string
): Promise<string> {
  let candidate = base || "workspace";
  let n = 1;
  while (await tx.workspace.findUnique({ where: { slug: candidate } })) {
    candidate = `${base}-${n++}`;
  }
  return candidate;
}
