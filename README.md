# The Deal Desk

A multi-profile, AI-assisted job-search application for senior procurement professionals.

The app is designed for Ayo's IT procurement job search and can also be used by a second candidate profile, such as his wife, without mixing CVs, target roles, assessments or pipeline history.

## What it does

- Stores editable candidate profiles.
- Stores separate search configurations per candidate.
- Sources roles from Adzuna and France Travail through server-side API calls.
- De-duplicates roles by company, title and location.
- Scores fit for each role with a language-model adapter.
- Generates tailored CV bullets and cover emails.
- Validates generated text so contractions do not reach the user.
- Tracks assessment and application history.
- Sends a daily digest from a protected scheduled endpoint.
- Exports and deletes all stored personal data.

## Local setup

```bash
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run dev
```

Visit `http://localhost:3000`.

## Daily run

```bash
curl -X POST http://localhost:3000/api/run/daily \
  -H "x-run-secret: $RUN_SECRET"
```

## Health check

```bash
curl http://localhost:3000/api/health
```

## Notes

This repository previously contained a simple driving-practice static app. The Deal Desk branch replaces it with a Next.js application. Keep all credentials in `.env`; do not place provider credentials in browser code.
