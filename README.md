# DaSo Montageplanung

Internal scheduling and timesheet app for DaSo Lüftungsbau: crew and subcontractor
planning by calendar week, project/document management, a geolocation-stamped
clock-in/out, and monthly expense/hours reporting. Access is restricted to DaSo
staff via Cloudflare Access (email one-time code, `@dasoluft.com` domain).

## Stack

- Next.js on [vinext](https://github.com/cloudflare/vinext), deployed as a Cloudflare Worker
- Cloudflare D1 (Drizzle ORM) for data, Cloudflare R2 for project files
- Cloudflare Access for authentication; app-level role checks (Planer / Obermonteur / Monteur) in `app/api/data/route.ts`

## Local development

Requires Node.js `>=22.13.0` and pnpm.

```bash
pnpm install --frozen-lockfile
pnpm run dev
```

## Build & deploy

```bash
pnpm run build
node scripts/patch-wrangler-config.mjs   # injects the production D1/R2 bindings
wrangler deploy --config dist/server/wrangler.json
```

Pushes to `main` deploy automatically via `.github/workflows/deploy.yml` (requires
a `CLOUDFLARE_API_TOKEN` repository secret with Workers Scripts edit access).

## Database migrations

```bash
pnpm run db:generate   # after editing db/schema.ts
wrangler d1 execute DB --remote --config dist/server/wrangler.json --file drizzle/<new-migration>.sql
```
