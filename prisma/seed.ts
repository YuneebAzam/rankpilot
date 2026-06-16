import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "demo@rankpilot.app";
  const passwordHash = await bcrypt.hash("demo1234", 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name: "Demo User", passwordHash },
  });

  // Personal workspace (OWNER).
  await prisma.workspace.upsert({
    where: { slug: "demo-workspace" },
    update: {},
    create: {
      name: "Demo Workspace",
      slug: "demo-workspace",
      plan: "PRO",
      memberships: { create: { userId: user.id, role: "OWNER" } },
    },
  });

  // A second workspace where the demo user is only an EDITOR — shows RBAC.
  const owner = await prisma.user.upsert({
    where: { email: "owner@acme.app" },
    update: {},
    create: {
      email: "owner@acme.app",
      name: "Acme Owner",
      passwordHash,
    },
  });

  await prisma.workspace.upsert({
    where: { slug: "acme-co" },
    update: {},
    create: {
      name: "Acme Co.",
      slug: "acme-co",
      plan: "AGENCY",
      memberships: {
        create: [
          { userId: owner.id, role: "OWNER" },
          { userId: user.id, role: "EDITOR" },
        ],
      },
    },
  });

  console.log("Seeded. Login: demo@rankpilot.app / demo1234");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
