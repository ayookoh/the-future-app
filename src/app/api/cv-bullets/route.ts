import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cvPrompt } from "@/lib/prompts";
import { callModel } from "@/lib/llm";
import { parseModelJson } from "@/lib/json";
import { assertNoContractions } from "@/lib/validators";

export async function POST(request: Request) {
  const body = await request.json();
  const row = await prisma.assessment.findUniqueOrThrow({
    where: { id: String(body.id) },
    include: { role: true, profile: true }
  });
  const words = JSON.parse(row.keywords) as string[];
  const text = await callModel(cvPrompt(row.profile.fullText, row.role.title, row.role.company, row.role.description, words), 60000);
  const bullets = parseModelJson<string[]>(text);
  for (const bullet of bullets) assertNoContractions(bullet);
  const saved = await prisma.assessment.update({ where: { id: row.id }, data: { cvBullets: JSON.stringify(bullets) } });
  return NextResponse.json(saved);
}
