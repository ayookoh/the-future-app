import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const data = {
    profiles: await prisma.candidateProfile.findMany(),
    searchConfigs: await prisma.searchConfig.findMany(),
    roles: await prisma.role.findMany(),
    assessments: await prisma.assessment.findMany(),
    applications: await prisma.application.findMany(),
    runs: await prisma.run.findMany()
  };
  return NextResponse.json(data);
}

export async function DELETE() {
  await prisma.$transaction([
    prisma.application.deleteMany(),
    prisma.assessment.deleteMany(),
    prisma.role.deleteMany(),
    prisma.searchConfig.deleteMany(),
    prisma.candidateProfile.deleteMany(),
    prisma.run.deleteMany()
  ]);
  return NextResponse.json({ deleted: true });
}
