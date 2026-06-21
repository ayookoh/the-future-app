import { env } from "./env";
import { fetchWithTimeout } from "./http";
import { roleDedupeHash } from "./dedupe";

export type NormalisedRole = {
  source: string;
  sourceId: string;
  dedupeHash: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  salary?: string;
  postedAt?: Date;
};

type SearchInput = {
  keywords: string;
  location: string;
  inseeCode?: string | null;
  radiusKm: number;
  maxDaysOld: number;
};

export async function fetchAdzuna(input: SearchInput): Promise<NormalisedRole[]> {
  if (!env("ADZUNA_APP_ID") || !env("ADZUNA_APP_KEY")) return [];
  const params = new URLSearchParams({
    app_id: env("ADZUNA_APP_ID"),
    app_key: env("ADZUNA_APP_KEY"),
    what: input.keywords,
    where: input.location,
    max_days_old: String(input.maxDaysOld),
    results_per_page: "25",
    sort_by: "date"
  });
  const response = await fetchWithTimeout(`https://api.adzuna.com/v1/api/jobs/fr/search/1?${params}`, {}, 30000);
  const json = await response.json();

  return (json.results ?? []).map((item: any) => {
    const company = item.company?.display_name ?? "Unknown company";
    const title = item.title ?? "Untitled role";
    const location = item.location?.display_name ?? input.location;
    return {
      source: "adzuna",
      sourceId: String(item.id),
      dedupeHash: roleDedupeHash(company, title, location),
      title,
      company,
      location,
      description: item.description ?? "",
      url: item.redirect_url ?? "",
      salary: item.salary_min || item.salary_max ? `${item.salary_min ?? ""} - ${item.salary_max ?? ""}` : undefined,
      postedAt: item.created ? new Date(item.created) : undefined
    };
  });
}

async function franceTravailToken(): Promise<string | null> {
  if (!env("FRANCE_TRAVAIL_CLIENT_ID") || !env("FRANCE_TRAVAIL_CLIENT_SECRET")) return null;
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: env("FRANCE_TRAVAIL_CLIENT_ID"),
    client_secret: env("FRANCE_TRAVAIL_CLIENT_SECRET"),
    scope: "api_offresdemploiv2 o2dsoffre"
  });
  const response = await fetchWithTimeout("https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=%2Fpartenaire", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body
  }, 30000);
  const json = await response.json();
  return json.access_token ?? null;
}

export async function fetchFranceTravail(input: SearchInput): Promise<NormalisedRole[]> {
  const token = await franceTravailToken();
  if (!token) return [];

  const params = new URLSearchParams({
    motsCles: input.keywords,
    rayon: String(input.radiusKm)
  });
  if (input.inseeCode) params.set("commune", input.inseeCode);

  const response = await fetchWithTimeout(`https://api.francetravail.io/partenaire/offresdemploi/v2/offres/search?${params}`, {
    headers: { authorization: `Bearer ${token}` }
  }, 30000);
  const json = await response.json();

  return (json.resultats ?? []).map((item: any) => {
    const company = item.entreprise?.nom ?? "Unknown company";
    const title = item.intitule ?? "Untitled role";
    const location = item.lieuTravail?.libelle ?? input.location;
    return {
      source: "france_travail",
      sourceId: String(item.id),
      dedupeHash: roleDedupeHash(company, title, location),
      title,
      company,
      location,
      description: item.description ?? "",
      url: item.origineOffre?.urlOrigine ?? "",
      salary: item.salaire?.libelle,
      postedAt: item.dateCreation ? new Date(item.dateCreation) : undefined
    };
  });
}
