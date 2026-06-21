# Decisions

1. The app is multi-profile rather than single-profile. This keeps Ayo's job search and his wife's job search separate while sharing the same sourcing, assessment and pipeline engine.
2. The data model uses `CandidateProfile` instead of `Profile` and links `SearchConfig` and `Assessment` to a specific profile.
3. SQLite with Prisma is used locally because this is a single-household tool and keeps personal data under direct control. The schema can move to PostgreSQL later with minimal changes.
4. The first implementation uses Next.js route handlers as the backend so API keys never enter the browser bundle.
5. The second profile is created as an editable placeholder. No facts are invented for Ayo's wife.
6. ROME codes are configurable per search. The initial seed uses the purchasing family examples and should be validated against France Travail referentials before production reliance.
7. The UI is intentionally functional rather than polished. The priority is secure sourcing, fit scoring, tailoring, pipeline data and daily digest automation.
