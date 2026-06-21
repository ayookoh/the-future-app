import { prisma } from "./prisma";
import { ayoDefaultProfile, wifePlaceholderProfile } from "./profileSeed";

export async function ensureDefaultData() {
  const count = await prisma.candidateProfile.count();
  if (count > 0) return;

  const primary = await prisma.candidateProfile.create({
    data: {
      label: ayoDefaultProfile.label,
      name: ayoDefaultProfile.name,
      fullText: ayoDefaultProfile.fullText,
      email: process.env.DIGEST_TO_EMAIL || null,
      phone: null,
      targetTitles: JSON.stringify(ayoDefaultProfile.targetTitles),
      locations: JSON.stringify(ayoDefaultProfile.locations),
      isDefault: true
    }
  });

  await prisma.candidateProfile.create({
    data: {
      label: wifePlaceholderProfile.label,
      name: wifePlaceholderProfile.name,
      fullText: wifePlaceholderProfile.fullText,
      targetTitles: JSON.stringify(wifePlaceholderProfile.targetTitles),
      locations: JSON.stringify(wifePlaceholderProfile.locations),
      isDefault: false
    }
  });

  await prisma.searchConfig.create({
    data: {
      profileId: primary.id,
      label: "IT procurement France",
      keywords: "IT Procurement Manager IT Category Manager Strategic Sourcing IT",
      location: "Paris",
      inseeCode: "75056",
      radiusKm: 80,
      romeCodes: JSON.stringify(["M1101", "M1102"]),
      maxDaysOld: 7,
      active: true
    }
  });
}
