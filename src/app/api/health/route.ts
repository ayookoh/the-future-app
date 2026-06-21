import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import { fetchWithTimeout } from "@/lib/http";

async function check(name: string, fn: () => Promise<unknown>) {
  try {
    await fn();
    return { name, status: "PASS" };
  } catch (error) {
    return { name, status: "FAIL", message: (error as Error).message };
  }
}

export async function GET() {
  const checks = await Promise.all([
    check("database", () => prisma.$queryRaw`SELECT 1`),
    check("model_provider", async () => {
      if (!env("LLM_PROVIDER") || !env("LLM_MODEL")) throw new Error("LLM provider or model not configured.");
    }),
    check("adzuna", async () => {
      if (!env("ADZUNA_APP_ID") || !env("ADZUNA_APP_KEY")) throw new Error("Adzuna credentials not configured.");
      await fetchWithTimeout(`https://api.adzuna.com/v1/api/jobs/fr/search/1?app_id=${env("ADZUNA_APP_ID")}&app_key=${env("ADZUNA_APP_KEY")}&what=procurement&results_per_page=1`, {}, 10000);
    }),
    check("france_travail", async () => {
      if (!env("FRANCE_TRAVAIL_CLIENT_ID") || !env("FRANCE_TRAVAIL_CLIENT_SECRET")) throw new Error("France Travail credentials not configured.");
    })
  ]);

  return NextResponse.json({ checks });
}
