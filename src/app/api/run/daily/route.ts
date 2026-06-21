import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { runDaily } from "@/lib/dailyRun";

export async function POST(request: Request) {
  const expected = env("RUN_SECRET");
  const provided = request.headers.get("x-run-secret");

  if (!expected || provided !== expected) {
    return NextResponse.json({ error: "Unauthorised daily run request." }, { status: 401 });
  }

  const run = await runDaily();
  return NextResponse.json(run);
}
