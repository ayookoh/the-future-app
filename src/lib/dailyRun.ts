import { prisma } from "./prisma";
import { fetchAdzuna, fetchFranceTravail } from "./jobSources";
import { firstPassScore } from "./scoring";
import { assessmentPrompt } from "./prompts";
import { callModel } from "./llm";
import { parseModelJson } from "./json";
import { sendDigest } from "./email";
import { appConfig } from "./env";

type AssessmentJson = {
  fit_score: number;
  tier: "A" | "B" | "C";
  verdict: string;
  strengths: string[];
  gaps: string[];
  keywords: string[];
};

export async function assessRole(roleId: string, profileId: string) {
  const [role, profile] = await Promise.all([
    prisma.role.findUniqueOrThrow({ where: { id: roleId } }),
    prisma.candidateProfile.findUniqueOrThrow({ where: { id: profileId } })
  ]);

  const raw = await callModel(assessmentPrompt(profile.fullText, role.title, role.company, role.description), 30000);
  const parsed = parseModelJson<AssessmentJson>(raw);

  return prisma.assessment.create({
    data: {
      roleId,
      profileId,
      fitScore: parsed.fit_score,
      tier: parsed.tier,
      verdict: parsed.verdict,
      strengths: JSON.stringify(parsed.strengths),
      gaps: JSON.stringify(parsed.gaps),
      keywords: JSON.stringify(parsed.keywords)
    }
  });
}

export async function runDaily() {
  const run = await prisma.run.create({ data: {} });
  const errors: string[] = [];
  let rolesFound = 0;
  let newRoles = 0;

  const configs = await prisma.searchConfig.findMany({
    where: { active: true },
    include: { profile: true }
  });

  for (const config of configs) {
    try {
      const input = {
        keywords: config.keywords,
        location: config.location,
        inseeCode: config.inseeCode,
        radiusKm: config.radiusKm,
        maxDaysOld: config.maxDaysOld
      };
      const sourced = [...await fetchAdzuna(input), ...await fetchFranceTravail(input)];
      rolesFound += sourced.length;

      for (const role of sourced) {
        const created = await prisma.role.upsert({
          where: { dedupeHash: role.dedupeHash },
          update: {},
          create: {
            ...role,
            firstPassScore: firstPassScore(config.profile.fullText, role.description)
          }
        });
        if (created.discoveredAt > run.startedAt) newRoles += 1;
      }

      const topRoles = await prisma.role.findMany({
        where: { assessments: { none: { profileId: config.profileId } } },
        orderBy: { firstPassScore: "desc" },
        take: 5
      });

      for (const role of topRoles) {
        try {
          await assessRole(role.id, config.profileId);
        } catch (error) {
          errors.push(`Assessment failed for ${role.title}: ${(error as Error).message}`);
        }
      }
    } catch (error) {
      errors.push(`Search ${config.label} failed: ${(error as Error).message}`);
    }
  }

  const topAssessments = await prisma.assessment.findMany({
    include: { role: true, profile: true },
    orderBy: { createdAt: "desc" },
    take: 10
  });

  const bestScore = topAssessments[0]?.fitScore ?? 0;
  const html = `<h1>Deal Desk daily roles</h1>${topAssessments.map((a) =>
    `<p><strong>${a.profile.label}: ${a.tier} ${a.fitScore}/100</strong> — ${a.role.title} at ${a.role.company}<br/>${a.verdict}<br/><a href="${appConfig.appBaseUrl}/roles/${a.roleId}">Open role</a></p>`
  ).join("")}`;

  await sendDigest(`Deal Desk — ${newRoles} new roles, top fit ${bestScore}/100`, html);

  return prisma.run.update({
    where: { id: run.id },
    data: { finishedAt: new Date(), rolesFound, newRoles, errors: JSON.stringify(errors) }
  });
}
