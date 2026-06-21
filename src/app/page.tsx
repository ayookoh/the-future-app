import { prisma } from "@/lib/prisma";

const ayoProfile = `Ayodele Okoh is an IT Category Manager and IT procurement professional based in Rambouillet, France, open to remote roles within Europe. He has fifteen years of IT procurement experience across hardware, software, SaaS, cloud, telecom, vendor risk, contract optimisation and regulated environments.

Experience includes Senior IT Buyer work at BNP Paribas CIB covering banking IT procurement, FIS, Microsoft, SAP ECC 6.0 migration exposure, Atlassian and strategic supplier governance. At Najar / Welii he focuses on SaaS and AI contract optimisation, enterprise software negotiation and supplier risk management. Earlier experience includes building procurement functions from zero at Dangote and SPS Nexus, including team leadership, direct budget ownership and pan-African IT contract frameworks.

Education includes an MBA from ISC Paris, CSCP from APICS and an engineering background. Languages: English native, French professional. Target roles include IT Category Manager, IT Procurement Manager, Strategic Sourcing Manager for IT, Vendor Risk Lead and Vendor Management Lead.`;

async function seedDefaults() {
  const count = await prisma.candidateProfile.count();
  if (count > 0) return;

  const ayo = await prisma.candidateProfile.create({
    data: {
      label: "Ayo",
      name: "Ayodele Okoh",
      fullText: ayoProfile,
      targetTitles: JSON.stringify(["IT Category Manager", "IT Procurement Manager", "Strategic Sourcing Manager IT", "Vendor Risk Lead"]),
      locations: JSON.stringify(["France", "Remote Europe", "Île-de-France"]),
      isDefault: true
    }
  });

  const second = await prisma.candidateProfile.create({
    data: {
      label: "Second candidate",
      name: "Profile owner",
      fullText: "Paste the second candidate's complete CV and target roles here. This profile is deliberately editable and does not contain invented achievements.",
      targetTitles: JSON.stringify([]),
      locations: JSON.stringify(["France", "Remote Europe"])
    }
  });

  await prisma.searchConfig.createMany({
    data: [
      {
        profileId: ayo.id,
        label: "Ayo — IT procurement France and remote Europe",
        keywords: "IT Procurement Manager OR IT Category Manager OR Strategic Sourcing Manager IT",
        location: "Île-de-France",
        inseeCode: "78120",
        radiusKm: 80,
        maxDaysOld: 7,
        romeCodes: JSON.stringify(["M1101", "M1102"])
      },
      {
        profileId: second.id,
        label: "Second candidate — configure target search",
        keywords: "",
        location: "France",
        radiusKm: 80,
        maxDaysOld: 7,
        romeCodes: JSON.stringify([]),
        active: false
      }
    ]
  });
}

export default async function Home() {
  await seedDefaults();

  const [profiles, roles, assessments] = await Promise.all([
    prisma.candidateProfile.findMany({ orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }] }),
    prisma.role.findMany({ orderBy: { discoveredAt: "desc" }, take: 8 }),
    prisma.assessment.findMany({ include: { role: true, profile: true }, orderBy: { createdAt: "desc" }, take: 8 })
  ]);

  return (
    <main>
      <h1>The Deal Desk</h1>
      <p className="muted">Multi-profile AI job-search desk for senior procurement applications. Each candidate profile runs with its own targets, locations and pipeline history.</p>

      <div className="grid">
        <section className="card">
          <h2>Candidate profiles</h2>
          {profiles.map((profile) => (
            <p key={profile.id}><strong>{profile.label}</strong><br /><small>{profile.name}</small></p>
          ))}
          <p className="muted">Use the profile API to update each CV, contact fields, target titles and preferred locations.</p>
        </section>

        <section className="card">
          <h2>Find roles now</h2>
          <p>Trigger the protected daily run from your scheduler or locally with the shared secret.</p>
          <code>POST /api/run/daily</code>
        </section>

        <section className="card">
          <h2>Recent roles</h2>
          {roles.length === 0 ? <p className="muted">No roles sourced yet.</p> : roles.map((role) => (
            <p key={role.id}><strong>{role.title}</strong><br /><small>{role.company} — {role.location}</small></p>
          ))}
        </section>
      </div>

      <section className="card" style={{ marginTop: 16 }}>
        <h2>Assessment history</h2>
        <table>
          <thead><tr><th>Candidate</th><th>Role</th><th>Score</th><th>Verdict</th></tr></thead>
          <tbody>
            {assessments.map((a) => (
              <tr key={a.id}>
                <td>{a.profile.label}</td>
                <td>{a.role.title}<br /><small>{a.role.company}</small></td>
                <td>{a.tier} {a.fitScore}/100</td>
                <td>{a.verdict}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
