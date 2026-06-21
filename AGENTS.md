# AGENTS.md

## Project

The Deal Desk is a multi-profile AI-assisted job-search desk for procurement professionals. It supports separate candidate profiles, role sourcing, fit assessment, tailored CV bullets, cover email generation, pipeline tracking and daily digest automation.

## Run commands

```bash
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run dev
```

Open `http://localhost:3000`.

## Test commands

```bash
npm test
npm run build
```

## Useful API routes

- `GET /api/health` checks database, model configuration, Adzuna and France Travail configuration.
- `GET /api/profiles` lists candidate profiles.
- `POST /api/profiles` creates or updates a profile.
- `GET /api/search-configs` lists search configurations.
- `POST /api/search-configs` creates or updates a search configuration.
- `GET /api/roles` lists sourced roles.
- `POST /api/roles/:id/assess` creates a fit assessment for a role/profile pair.
- `POST /api/assessments/:id/materials` creates tailored CV bullets and a cover email.
- `POST /api/run/daily` executes the protected daily run. Requires `x-run-secret`.
- `POST /api/export-delete` exports stored data and deletes it.

## Project structure

- `prisma/schema.prisma` database schema.
- `src/app` Next.js application and route handlers.
- `src/lib` backend adapters, prompts, validators, job sources, orchestration and tests.

## Security rules

Keep service credentials in environment variables and route all external provider calls through the backend timeout helper.
