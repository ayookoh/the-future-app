import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  id: z.string().optional(),
  profileId: z.string(),
  label: z.string(),
  keywords: z.string(),
  location: z.string(),
  inseeCode: z.string().optional().nullable(),
  radiusKm: z.number().int().positive().default(50),
  romeCodes: z.array(z.string()).default([]),
  maxDaysOld: z.number().int().positive().default(7),
  active: z.boolean().default(true)
});

export async function GET() {
  const configs = await prisma.searchConfig.findMany({ include: { profile: true } });
  return NextResponse.json(configs);
}

export async function POST(request: Request) {
  const parsed = schema.parse(await request.json());
  const data = { ...parsed, romeCodes: JSON.stringify(parsed.romeCodes) };
  const config = parsed.id
    ? await prisma.searchConfig.update({ where: { id: parsed.id }, data })
    : await prisma.searchConfig.create({ data });
  return NextResponse.json(config);
}
