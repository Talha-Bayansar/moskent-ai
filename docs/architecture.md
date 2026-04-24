# Architecture

This file records the current technical shape of the application. It must be updated when implementation changes in ways that affect structure, boundaries, or data flow.

## Current Known Foundation

- Application framework: TanStack Start
- UI foundation: React, TypeScript, shadcn/ui
- Internationalization layer: Paraglide JS
- Server-state layer: TanStack Query
- Intended forms layer: TanStack Form
- Database layer: Neon Postgres with Drizzle ORM
- Authentication layer: Better Auth with email/password enabled and reusable auth UI now present

Where code and this file disagree, update this file or resolve the implementation mismatch in the same change.

## App Structure

Current known repository structure:

- `src/routes/`: TanStack Start file-based route adapters only
- `src/app/`: app-wide bootstrapping and root document composition
- `src/pages/`: page-level UI owned outside the routing layer
- `src/widgets/`: reusable page sections when they emerge
- `src/features/`: user-facing feature slices when they emerge
- `src/entities/`: domain slices, including entity-owned persistence code
- `src/shared/`: shared UI primitives, utilities, and database infrastructure

Current routing structure rules:

- concrete routes use folder-based entries with `index.tsx`
- nested routes use nested folders under `src/routes/`
- dynamic segments use TanStack param folders such as `$organizationId`
- framework-required/generated exceptions remain allowed, including `__root.tsx` and `routeTree.gen.ts`
- authenticated dashboard routes now use `src/routes/dashboard.tsx` as a parent sidebar layout route, with `src/routes/dashboard/index.tsx` remaining the dashboard landing page and future child routes rendering through the parent `Outlet`

Current file naming convention:

- authored files and folders use kebab-case
- framework-required/generated names are the only exceptions
- server-only modules use `.server.ts`
- server functions use `.functions.ts`

## Data Flow

Current high-level expectation:

- route modules compose TanStack Router configuration and hand off rendering to page modules
- router URL input/output is localized through Paraglide rewrite helpers
- UI and page modules collect user input
- application logic coordinates structured actions
- persistence flows through Postgres via Drizzle
- auth/session state is managed through Better Auth mounted at `/api/auth/*`
- locale detection flows through Paraglide using URL, cookie, preferred language, then base locale fallback
- AI-driven workflows will translate natural-language input into structured application operations

Concrete request, mutation, and orchestration flows: `TBD`

## Boundaries

Current intended boundaries:

- route modules stay thin and focused on TanStack Router concerns such as loaders, params, and metadata
- page modules own route-facing UI instead of embedding long-term page components directly in route files
- reusable UI primitives live in `src/shared/ui/`
- shared utilities live in `src/shared/lib/`
- shared i18n helpers and locale-aware UI live in `src/shared/i18n/`
- low-level database bootstrap lives in `src/shared/database/`
- shared TanStack Query bootstrap lives in `src/shared/query/`
- shared auth bootstrap lives in `src/shared/auth/`
- entity tables and entity-specific persistence should live in `src/entities/<entity>/` once domain slices are added
- auth, data access, and AI orchestration should remain explicit boundaries as they emerge
- organization creation now lives in a dedicated feature slice and is exposed through the authenticated `/organizations/new` route
- organization list and active-organization switching are exposed through the organizations feature slice and consumed during authenticated app bootstrap

Current dependency direction:

- `app -> pages -> widgets -> features -> entities -> shared`
- `shared` must not depend on higher layers
- `entities` may depend only on `shared`
- `routes` are framework adapters over `app` and `pages`, not a general-purpose logic layer

## Future Architecture Notes

Use this section for short forward-looking notes that are grounded in active work, not speculation.

- AI orchestration boundary: `TBD`
- organization and membership auth foundation now uses Better Auth's organization plugin with dynamic per-organization roles; product workflows on top remain `TBD`
- action execution model for structured AI operations: `TBD`
- observability and audit strategy for AI actions: `TBD`

## Database Foundation

Current database setup:

- `src/shared/database/env.server.ts`: runtime validation for server database configuration
- `src/shared/database/client.server.ts`: Neon serverless HTTP client wrapped by Drizzle
- `src/shared/database/schema/index.ts`: shared schema aggregation point, including Better Auth tables
- `src/shared/database/migrations/`: committed Drizzle migration output directory
- `drizzle.config.ts`: Drizzle Kit configuration for schema generation and migrations

Current auth setup:

- `src/shared/auth/env.server.ts`: runtime validation for Better Auth configuration
- `src/shared/auth/auth.server.ts`: Better Auth server instance backed by the shared Drizzle client
- `src/shared/auth/auth-client.ts`: Better Auth client helper for future UI work
- `src/shared/auth/ui/auth-page-shell.tsx`: centered auth page chrome shared by sign-in and sign-up pages
- `src/shared/auth/ui/sign-in-form.tsx`: reusable sign-in form built with TanStack Form and Zod
- `src/shared/auth/ui/sign-up-form.tsx`: reusable sign-up form built with TanStack Form and Zod
- `src/shared/auth/ui/authenticated-route.tsx`: shared client-side protected-route wrapper for authenticated pages
- `src/shared/auth/organization-session.ts`: shared organization session query and active-organization mutation helpers used by authenticated bootstrap and re-exported by the organizations feature
- `src/shared/auth/permissions.ts`: shared access-control statements and baseline organization roles reused by server and client auth setup
- `src/shared/auth/schema.ts`: generated Better Auth Drizzle schema committed into the repo
- `src/routes/api/auth/$.ts`: TanStack Start route that forwards `GET` and `POST` requests to Better Auth

Current i18n setup:

- `project.inlang/settings.json`: base locale and supported locale declarations for Paraglide
- `messages/*.json`: source translation files for English, Dutch, and Turkish
- `src/paraglide/`: generated Paraglide runtime, server middleware, and message modules
- `scripts/paraglide-options.mjs`: shared Paraglide compiler/plugin options
- `server.ts`: TanStack Start server entry wrapped with `paraglideMiddleware`
- `src/shared/i18n/locale-switcher.tsx`: reusable select-based locale switcher used across page shells and other locale-aware UI

Current i18n workflow notes:

- English is the base locale and stays unprefixed
- Dutch and Turkish use URL prefixes such as `/nl/...` and `/tr/...`
- locale detection order is URL, cookie, preferred language, then base locale fallback
- `/api/*` is excluded from locale routing behavior
- regenerate the committed Paraglide runtime with `pnpm paraglide:compile` after changing locale settings or message files

Current server-state setup:

- `src/shared/query/query-client.ts`: shared `QueryClient` factory with project-level defaults
- `src/app/create-router.ts`: creates one TanStack Query client per router instance and wires SSR query hydration through `@tanstack/react-router-ssr-query`

Current server-state workflow notes:

- organization list state is loaded through TanStack Query after authentication and before protected dashboard UI renders
- organization feature query keys and mutations wrap Better Auth organization client APIs rather than using Better Auth hooks as the app data-access layer
- query clients are created per router instance to stay compatible with SSR and future request-scoped rendering
- route modules and pages should start consuming TanStack Query only when real server-state behavior is introduced

Current auth environment requirements:

- `BETTER_AUTH_SECRET`: required server secret, minimum 32 characters
- `BETTER_AUTH_URL`: required public base URL for Better Auth

Current auth workflow notes:

- email/password auth is enabled as the first backend auth method
- Better Auth's organization plugin is enabled as shared infrastructure, and app-owned organization workflows use client APIs wrapped by TanStack Query
- app-owned auth entry routes now exist at `/sign-in` and `/sign-up`; sign-in and sign-up use reusable TanStack Form UI
- organization creation is implemented at `/organizations/new` with a TanStack Form UI and a Better Auth organization create mutation
- current authenticated pages use a shared client-side `AuthenticatedRoute` wrapper that shows a loading state while `authClient.useSession()` resolves, redirects unauthenticated users to `/sign-in?redirectTo=...`, loads the current user's organizations, redirects users without organizations to `/organizations/new`, and ensures a Better Auth active organization is set before rendering protected dashboard UI
- the dashboard sidebar header uses the organization switcher instead of the application name
- dynamic per-organization custom roles are stored through Better Auth's `organization_role` table rather than app-owned role tables
- shared baseline organization roles are `owner`, `admin`, and `member`, with additional runtime role management gated by the Better Auth `ac` permission resource
- verification emails, password reset, and server-first protected-route conventions are still `TBD`
- regenerate the committed auth schema with `pnpm auth:generate` when Better Auth config or plugins change
- generate SQL migrations for committed schema changes with `pnpm db:generate`

Current database ownership rule:

- shared database code owns connection/bootstrap only
- first real tables and relations should be added from entity slices and re-exported through the shared schema index
- the initial database setup intentionally does not define product tables yet

## Maintenance Rule

Update this file when:

- folders or ownership boundaries change
- data flow changes materially
- auth or database integration strategy changes
- new durable architectural patterns are introduced
