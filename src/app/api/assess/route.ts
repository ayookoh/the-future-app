import { NextResponse } from "next/server";
import { assessRole } from "@/lib/dailyRun";

export async function POST(request: Request) {
  const body = await request.json();
  const result = await assessRole(String(body.roleId), String(body.profileId));
  return NextResponse.json(result);
}
