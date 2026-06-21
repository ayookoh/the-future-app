import { NextResponse } from "next/server";
import { z } from "zod";
import { assessRole } from "@/lib/dailyRun";

const schema = z.object({ profileId: z.string() });

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const { profileId } = schema.parse(await request.json());
  const assessment = await assessRole(id, profileId);
  return NextResponse.json(assessment);
}
