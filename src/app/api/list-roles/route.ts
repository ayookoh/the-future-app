import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const rows = await prisma.role.findMany({
    orderBy: { discoveredAt: "desc" },
    take: 100
  });
  return NextResponse.json(rows);
}
