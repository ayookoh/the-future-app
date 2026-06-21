import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { callModel } from "@/lib/llm";
import { cvPrompt, coverPrompt } from "@/lib/prompts";
import { parseModelJson } from "@/lib/json";
import { assertNoContractions } from "@/lib/validators";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const assessment = await prisma.assessment.findUniqueOrThrow({
    where: { id },
    include: { role: true, profile: true }
  });

  const keywords = JSON.parse(assessment.keywords) as string[];
  const bulletsRaw = await callModel(cvPrompt(assessment.profile.fullText, assessment.role.title, assessment.role.company, assessment.role.description, keywords), 60000);
  const bullets = parseModelJson<string[]>(bulletsRaw);
  const coverEmail = await callModel(coverPrompt(assessment.profile.fullText, assessment.profile.name, assessment.role.title, assessment.role.company, assessment.role.description), 60000);

  assertNoContractions([...bullets, coverEmail].join("\n"));

  const updated = await prisma.assessment.update({
    where: { id },
    data: { cvBullets: JSON.stringify(bullets), coverEmail }
  });

  return NextResponse.json(updated);
}
