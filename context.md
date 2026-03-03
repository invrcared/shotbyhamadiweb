# Project Memory Context

## Current Progress
- Next.js (App Router) initialized successfully.
- Baseline documentation (`rules.md`, `context.md`) created.
- The `legacy/` directory contains the old static HTML site for reference.

## Next 3 Priority Tasks
1. Set up the Cloudflare D1 database connections and establish the API layer for Next.js to communicate with D1.
2. Build the public "Services" page to dynamically pull and display pricing from D1.
3. Configure Cloudflare R2 and build the Public Portfolio masonry gallery.

## Active Database Schemas (Cloudflare D1)

*Currently setting up base schemas:*
- `Services` (id, title, description, price, features, category, travel_fee, policy_note, is_active) *Note: `features` is stored as a JSON-stringified array.*
- `Projects` (id, project_code, client_name, client_email, created_at, folder_path, location, project_password, base_price, travel_surcharge, notes) *Note: Authenticated via Server Action setting a secure session cookie ('client_session').*

## Known Cloudflare Edge Gotchas
- **"Cannot find module" Crashes**: Often caused by a corrupted Webpack cache targeting Node APIs instead of Edge. Fix by running `rm -rf .next` and ensuring `export const runtime = 'edge';` is set in `app/layout.tsx`.
- **TypeError: reading 'default'**: Caused by `Node.js` specific libraries or improper CJS module resolution. Always ensure heavy icons or node libraries are not accidentally imported into Client Components (`"use client"`).

## Build Stability
- **Current Status**: The Next.js 15 build is now stable and successfully outputting Edge routes.
- **Root Conflict Resolution**: If standard `next build` emits a lockfile warning, lock the config using `outputFileTracingRoot: path.join(__dirname, './')` in `next.config.ts` so the Cloudflare build doesn't target the home directory's root `package-lock.json`.

## R2 Bucket Structures
*(Pending implementation. Will map projects/project_code to paths.)*
