export function env(name: string, fallback = ""): string {
  return process.env[name] ?? fallback;
}

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export const appConfig = {
  timezone: env("TIMEZONE", "Europe/Paris"),
  appBaseUrl: env("APP_BASE_URL", "http://localhost:3000")
};
