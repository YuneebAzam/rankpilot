import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { keywordResearchSchema } from "@/lib/validations";
import { getKeywordProvider } from "@/lib/keywords/provider";

// POST /api/keywords/research — seed topic -> keyword ideas (any signed-in user).
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = keywordResearchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const ideas = await getKeywordProvider().research(parsed.data.seed);
  return NextResponse.json({ ideas });
}
