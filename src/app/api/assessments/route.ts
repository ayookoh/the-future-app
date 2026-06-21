import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { assessRole } from "@/lib/dailyRun";
import { callModel } from "@/lib/llm";
import { parseModelJson } from "@/lib/json";
import { assertNoContractions } from "@/lib/validators";
import { coverPrompt, cvPrompt } from "@/lib/prompts";

export async function POST(request: Request) {
  const body = await request.json();
  const assessment = await assessRole(String(body.roleId), String(body.profileId));
  return NextResponse.json(assessment, { status: 201 });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const assessment = await prisma.assessment.findUniqueOrThrow({
    where: { id: String(body.assessmentId) },
    include: { role: true, profile: true }
  });
  const keywords = JSON.parse(assessment.keywords) as string[];

  const cvText = await callModel(cvPrompt(assessment.profile.fullText, assessment.role.title, assessment.role.company, assessment.role.description, keywords), 60000);
  const cvBullets = parseModelJson<string[]>(cvText);
  cvBullets.forEach(assertNoContractions);

  const coverEmail = await callModel(coverPrompt(assessment.profile.fullText, assessment.profile.name, assessment.role.title, assessment.role.company, assessment.role.description), 60000);
  assertNoContractions(coverEmail);

  const updated = await prisma.assessment.update({
    where: { id: assessment.id },
    data: {
      cvBullets: JSON.stringify(cvBullets),
      coverEmail
    }
  });
  return NextResponse.json(updated);
}
