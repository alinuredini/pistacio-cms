# Pistacio CMS (Strapi v5)

This package is a Strapi v5 application that powers the marketing site content. It runs alongside the Astro app via npm workspaces.

## Local development

```bash
cp cms/.env.example cms/.env
# fill the secrets (use `node -e "console.log(crypto.randomBytes(16).toString('base64'))"`)
npm install
npm run cms:dev
```

By default the local server uses SQLite (`cms/data.db`) and runs at `http://localhost:1337/admin`.

## Seeding from existing fallbacks

Run after Strapi has started at least once and the schema has been migrated:

```bash
npm run cms:seed
```

The seed script reads the existing TypeScript content in `src/content/*` and pushes it into Strapi via `entityService`, creating both `de` and `en` localized entries.

## Production (Postgres + Docker)

Set the required env vars (see `cms/.env.example`) and run:

```bash
cd cms
docker compose up --build -d
```

Strapi listens on `1337`, Postgres on `5432`. Mount real volumes / use a managed Postgres in real production environments.

## Wiring with Astro

The Astro site reads from the public REST API at build time using `STRAPI_URL` and `STRAPI_TOKEN`. If either is missing or a request fails, the loader silently falls back to the existing TypeScript content under `src/content/*`, so Astro always builds.
