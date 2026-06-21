import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { coverPrompt } from "@/lib/prompts";
import { callModel } from "@/lib/llm";
import { assertNoContractions } from "@/lib/validators";

export async function POST(request: Request) {
  const body = await request.json();
  const row = await prisma.assessment.findUniqueOrThrow({
    where: { id: String(body.id) },
    include: { role: true, profile: true }
  });
  const text = await callModel(coverPrompt(row.profile.fullText, row.profile.name, row.role.title, row.role.company, row.role.description), 60000);
  assertNoContractions(text);
  const saved = await prisma.assessment.update({ where: { id: row.id }, data: { coverEmail: text } });
  return NextResponse.json(saved);
}
