import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const profileSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  fullText: z.string().min(20),
  targetTitles: z.array(z.string()).default([]),
  locations: z.array(z.string()).default([]),
  isDefault: z.boolean().default(false)
});

export async function GET() {
  const profiles = await prisma.candidateProfile.findMany({ orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }] });
  return NextResponse.json(profiles);
}

export async function POST(request: Request) {
  const parsed = profileSchema.parse(await request.json());
  const data = {
    ...parsed,
    email: parsed.email || null,
    targetTitles: JSON.stringify(parsed.targetTitles),
    locations: JSON.stringify(parsed.locations)
  };

  const profile = parsed.id
    ? await prisma.candidateProfile.update({ where: { id: parsed.id }, data })
    : await prisma.candidateProfile.create({ data });

  return NextResponse.json(profile);
}
