# CLAUDE.md

Guidance for working in this repo. Read this before making changes.

## What this is

An independent retail / e-commerce platform built on **Payload CMS v3 + Next.js**, developed as a supervised learning project in **verifiable, gated phases** (see PRD). One Next.js codebase holds both the admin/CMS (`(payload)` route group) and the public storefront (`(frontend)` route group) — there is no separate theme layer; data is fetched directly in Server Components via the Payload Local API.

**Status:** Phases 0–3 complete (scaffold, data models, frontend foundation, catalog + PDP). Phase 4 (search) is next and not started.

## Rules of engagement (important)

1. **Stop at every phase gate.** Don't begin a phase until the previous phase's acceptance criteria pass and the supervisor approves. Respect each phase's "Not in this phase" scope — scope creep is the main failure mode.
2. **Confirm APIs before using them.** Payload v3 is recent and training data blends v2/v3. Verify any Payload API/field/import against the installed package types in `node_modules` or the official docs at https://payloadcms.com/docs. Don't guess import paths.
3. **Lexical, not Slate.** Rich text uses `@payloadcms/richtext-lexical`. Render on the frontend with the official `RichText` component from `@payloadcms/richtext-lexical/react` (see `src/components/RichText`). Never hand-roll a JSON parser.
4. **Local API for server data.** Fetch in Server Components via `getPayload({ config })` + `payload.find/findGlobal`. Do not make HTTP/REST calls from the app to its own API.
5. **Types are generated.** After any schema change run `generate:types` and import from `src/payload-types.ts`. Keep TypeScript strict — run `tsc --noEmit` before committing (the dev server uses SWC and does NOT type-check).
6. **Commit per phase** with a `phase-N: …` message and push to `origin/main`.

## Toolchain & commands

- **Package manager: pnpm 10 via corepack.** The machine's global pnpm (11.x) is incompatible with the template's `engines.pnpm` (`^9 || ^10`). Always run:
  ```
  COREPACK_ENABLE_DOWNLOAD_PROMPT=0 corepack pnpm@10 <cmd>
  ```
  (`package.json` pins `"packageManager": "pnpm@10.34.3"`.)
- **Node** ≥ 20.9 (Payload requirement). **PostgreSQL** local on `localhost:5432`.
- Key scripts: `dev`, `build`, `generate:types`, `generate:importmap`, `lint`, `payload`.
- **Seed (repeatable):** `corepack pnpm@10 payload run src/seed.ts` — generates placeholder images with sharp, wipes + reseeds 3 categories / 8 products / 2 pages / site-settings, and creates the admin user if none exists.
- **Local admin (dev):** `admin@example.com` / `Password123!` at `/admin`.

## Stack (verified versions)

Payload `3.85.1`, Next.js `16.2.6`, React `19.2.6`, `@payloadcms/db-postgres` `3.85.1`, Tailwind **v4** (CSS-first), TypeScript strict. Image storage: **local disk** (`public/media`), served at `/api/media/file/<filename>` (whitelisted in `next.config.ts` `images.localPatterns`). Cloud storage adapter is a Phase 6 concern.

## Architecture

- **`src/payload.config.ts`** — collections `[Pages, Products, Media, Categories, Users]`, global `[SiteSettings]`, `postgresAdapter` reading `process.env.DATABASE_URL`, `editor: defaultLexical`. No plugins.
- **Collections / global** (`src/collections/`, `src/globals/`):
  - `products` — title, slug, `authorOrBrand`, `price` (number, min 0, **major currency units**), `description` (richText), `image` (upload→media, required), `category` (relationship→categories, required), `inventoryStatus` (select: `in-stock` / `low-stock` / `out-of-stock`).
  - `pages` — title, slug, optional `heroImage`, `body` (richText).
  - `categories` — title, slug, description (plain text). `media` — upload collection. `users` — auth.
  - `site-settings` global — `headerNavLinks`, `footerLinks`, `storeAddress`, `socialLinks`.
  - **Slugs** use Payload's core `slugField()` (auto from `title`, unique, required). Because the type marks slug required, seed/programmatic `create` must pass an explicit `slug`.
- **Frontend** (`src/app/(frontend)/`): root layout with Geist fonts + theme provider; `/` (home page + featured strip), `/[slug]` (CMS pages), `/products` (catalog: grid, pagination via `limit`/`page`, category filter `?category=<slug>` using `where: { 'category.slug': { equals } }`), `/products/[slug]` (PDP). Static segments (`products/`) outrank the `[slug]` catch-all.
- **Data fetching:** Local API wrapped in React `cache()` (`src/utilities/getSiteSettings.ts`, `queryPageBySlug.ts`, `queryProductBySlug.ts`). Deliberately NOT `unstable_cache` — there are no revalidation hooks yet, so `cache()` keeps content fresh on refresh. (Revisit in Phase 6.)
- **Theme:** light/dark via `src/providers/Theme` + `InitTheme` (next/script `beforeInteractive`); `<html data-theme="light">` default; `ThemeToggle` in the header.
- **Shared components:** `RichText`, `Media` (next/image + `getMediaUrl`), `Container`, `SiteHeader`/`SiteFooter` (driven by `site-settings`), `ProductCard`, `InventoryBadge`, `AddToCartButton` (placeholder until Phase 5), `CategoryFilter`, `Pagination`. `cn` util = clsx + tailwind-merge.

## `reference/` — read-only

`reference/website-template-src/` is a frozen snapshot of the original Payload **website template** `src/`, kept for pattern reference. It is **excluded from build, typecheck, and lint** (`tsconfig.json` exclude, `eslint.config.mjs` ignores) — do not import from it; crib patterns by reading it.

## Gotchas

- **Schema changes in dev use Postgres "push".** Destructive diffs (dropping columns/tables) can hang on an interactive prompt in a non-interactive shell. For large schema changes, reset first: `dropdb payload_learning_shop && createdb payload_learning_shop`, then reseed.
- The **404 page** logs a `404` resource console error (correct — it returns a real 404 status) plus a dev-only React script warning on the not-found boundary (stripped in production). Neither appears on real content pages.
- Env var is **`DATABASE_URL`** (the PRD draft said `DATABASE_URI`; the code uses `DATABASE_URL`). `.env` is gitignored; `.env.example` documents the Postgres connection.

## Phase roadmap

- ✅ **0** scaffold · ✅ **1** data models · ✅ **2** frontend foundation · ✅ **3** catalog + PDP
- ⬜ **4** global search (4a: header search, `like`/`or` over title + authorOrBrand; 4b optional: `@payloadcms/plugin-search` for descriptions)
- ⬜ **5** persistent client cart (localStorage) + labeled checkout **stub** (no payment — project ends at a verified cart)
- ⬜ **6** polish: SEO, drafts/versions, access control, loading/error states, cloud image adapter, Postgres migrations
