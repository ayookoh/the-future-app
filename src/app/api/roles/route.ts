import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const roles = await prisma.role.findMany({
    include: { assessments: true, application: true },
    orderBy: { discoveredAt: "desc" },
    take: 100
  });
  return NextResponse.json(roles);
}
