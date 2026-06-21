import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const data = {
    profiles: await prisma.candidateProfile.findMany(),
    searchConfigs: await prisma.searchConfig.findMany(),
    roles: await prisma.role.findMany(),
    assessments: await prisma.assessment.findMany(),
    applications: await prisma.application.findMany(),
    runs: await prisma.run.findMany()
  };

  await prisma.application.deleteMany();
  await prisma.assessment.deleteMany();
  await prisma.role.deleteMany();
  await prisma.searchConfig.deleteMany();
  await prisma.candidateProfile.deleteMany();
  await prisma.run.deleteMany();

  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: {
      "content-type": "application/json",
      "content-disposition": "attachment; filename=deal-desk-export.json"
    }
  });
}
