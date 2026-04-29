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
- `src/pages/not-found/ui/not-found-page.tsx`: localized 404 page rendered from the root route's `notFoundComponent`
- `src/widgets/`: reusable page sections when they emerge
- `src/features/`: user-facing feature slices
- `src/entities/`: domain slices, including entity-owned persistence code and repository helpers
- `src/shared/`: shared UI primitives, utilities, and database infrastructure
- `src/shared/ui/delete-confirmation-dialog.tsx`: reusable destructive confirmation dialog for delete-oriented flows
- `src/shared/ui/infinite-scroll-list.tsx`: reusable infinite-scroll list shell driven by `IntersectionObserver`
- organization-related feature slices currently split model concerns into `schema`, `queries`, `mutations`, and `types` files, with visual components kept under `ui/`

Feature and entity slices should be grouped by responsibility instead of keeping every file type in one flat folder:

- `model/`: state, query keys, hooks, schemas, derived types, and other non-visual logic
- `ui/`: visual components only
- `server/`: server functions, app use cases, and server-only orchestration
- `repository/`: persistence helpers and database access when a slice owns data access directly
- `lib/`: small pure helpers that do not fit the other buckets

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
- locale detection flows through Paraglide using cookie, URL, preferred language, then base locale fallback
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
- shared auth code is split into `server/`, `model/`, and `ui/` buckets so server bootstrap, query/mutation logic, and components stay visually separated
- entity tables and entity-specific persistence should live in `src/entities/<entity>/` once domain slices are added
- auth, data access, and AI orchestration should remain explicit boundaries as they emerge
- organization creation now lives in a dedicated feature slice and is exposed through the authenticated `/organizations/new` route, which renders either the header-only access shell or the dashboard shell depending on organization membership
- organization list and active-organization switching are exposed through the organizations feature slice and consumed during authenticated app bootstrap
- organization members are loaded through a feature-slice TanStack Query infinite list backed by Better Auth's `organization.listMembers` endpoint and rendered from `/dashboard/members`; individual member edits now use `/dashboard/members/$memberId/edit` with Better Auth's `organization.updateMemberRole(...)`, and member removal uses `organization.removeMember(...)` behind a shared destructive confirmation dialog
- organization roles are loaded through a feature-slice TanStack Query infinite list backed by the shared `organization_role` table and rendered from `/dashboard/roles`; individual role edits now use `/dashboard/roles/$roleId/edit` with Better Auth's `organization.getRole(...)` and `organization.updateRole(...)`, while non-default role deletion stays on the overview menu and uses `organization.deleteRole(...)` behind the shared destructive confirmation dialog
- organization role creation is exposed through `/dashboard/roles/new` and uses a TanStack Query mutation around Better Auth's `organization.createRole(...)` client API rather than a custom database write helper
- organization invitations now live in a dedicated organizations feature slice and are exposed through the authenticated `/dashboard/members/invite` route, while pending user invitations are surfaced from the session-only `/organizations/invitations` route and the authenticated `/dashboard/invitations` route
- `/organizations` and `/organizations/invitations` use the shared organization-access shell with utility navigation instead of the dashboard sidebar layout, while `/organizations/new` switches shells based on membership and `/dashboard/invitations` uses the dashboard shell
- the dashboard sidebar header includes an organization switcher with a dedicated create-organization action that links to `/organizations/new`
- authenticated `/dashboard` currently hosts the chat-like AI workspace shell; AI orchestration, persistence, and action execution remain `TBD`, while `/dashboard/roles` adds the first organization-role browser
- authenticated app surfaces are designed mobile-first with PWA-conscious safe-area spacing, drawer navigation on small screens, and desktop sidebar behavior on larger screens

Current dependency direction:

- `app -> pages -> widgets -> features -> entities -> shared`
- `shared` must not depend on higher layers
- `entities` may depend only on `shared`
- `routes` are framework adapters over `app` and `pages`, not a general-purpose logic layer

Current hook guidance:

- avoid `useEffect` by default
- prefer derived state, event handlers, TanStack Query state, router loaders, or explicit mutations when they can express the same behavior
- use `useEffect` only when it is the only or most logical option for browser APIs, subscriptions, or other true side effects
- keep unavoidable `useEffect` usage local and narrow so components do not accumulate hidden performance work
- this is a performance-oriented convention: unnecessary effect chains can make future behavior harder to reason about and can lead to avoidable rendering cost

## Future Architecture Notes

Use this section for short forward-looking notes that are grounded in active work, not speculation.

- AI orchestration boundary: `TBD`
- authenticated AI interaction surface starts at `/dashboard`; current implementation is a UI shell only
- mobile is the primary layout baseline for authenticated workspace UI; future dashboard routes should preserve app-like mobile navigation and avoid desktop-only page composition
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

- `src/shared/auth/server/env.server.ts`: runtime validation for Better Auth configuration
- `src/shared/auth/server/auth.server.ts`: Better Auth server instance backed by the shared Drizzle client
- `src/shared/auth/server/current-user.server.ts`: server-only helper that combines Better Auth session data, active organization state, and active role permissions
- `src/shared/auth/server/current-user.functions.ts`: TanStack Start server function wrapper around the current-user helper
- `src/shared/auth/server/organization-roles.server.ts`: server-only helper that lazily ensures baseline dynamic organization roles exist before role permission lookup
- `src/shared/auth/server/schema.ts`: Better Auth Drizzle schema consumed by the shared database schema index
- `src/shared/auth/permissions.ts`: shared Better Auth access-control statements, baseline role definitions, and permission maps reused by client setup and server-side role bootstrapping
- `src/shared/auth/model/auth-client.ts`: Better Auth client helper for future UI work
- `src/shared/auth/model/current-user.ts`: TanStack Query current-user query owned by the app, replacing direct client-store reads in route and page logic
- `src/shared/auth/model/permission-checks.ts`: pure resource/action permission helper backed by the current-user active role permission map
- `src/shared/auth/model/session.ts`: compatibility re-export for the current-user query during the migration away from session-only reads
- `src/shared/auth/model/auth-cache.ts`: auth query cache reset and hydration helpers used after auth and organization transitions, including the current-user cache
- `src/shared/auth/model/auth-mutations.ts`: auth sign-in, sign-up, and sign-out mutations
- `src/shared/auth/model/organization-session.ts`: organization query and active-organization mutation helpers
- `src/shared/auth/model/query-keys.ts`: auth query-key helpers and cache clearing for the current-user and organization namespaces
- `src/shared/auth/model/post-auth-redirect.ts`: shared post-auth redirect resolution rules
- `src/shared/auth/model/permissions.ts`: shared Better Auth access-control statements and baseline roles
- `src/shared/auth/ui/auth-page-shell.tsx`: centered auth page chrome shared by sign-in and sign-up pages
- `src/shared/auth/ui/sign-in-form.tsx`: reusable sign-in form built with TanStack Form and Zod
- `src/shared/auth/ui/sign-up-form.tsx`: reusable sign-up form built with TanStack Form and Zod
- `src/shared/auth/ui/permission-gate.tsx`: client-side permission gate that reads the current-user query and hides denied children by default
- `src/shared/auth/ui/sign-out-button.tsx`: reusable sign-out trigger with confirmation dialog
- `src/shared/auth/ui/profile-menu.tsx`: authenticated-user dropdown that surfaces the current signed-in user and reuses the sign-out button
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
- `src/routes/dashboard/settings/index.tsx`: authenticated dashboard settings route for user preferences such as locale
- `src/routes/settings/index.tsx`: authenticated organization-access settings route for the same shared settings page component

Current i18n workflow notes:

- English is the base locale and stays unprefixed
- Dutch and Turkish use URL prefixes such as `/nl/...` and `/tr/...`
- locale detection order is cookie, URL, preferred language, then base locale fallback
- `/api/*` is excluded from locale routing behavior
- regenerate the committed Paraglide runtime with `pnpm paraglide:compile` after changing locale settings or message files

Current server-state setup:

- `src/shared/query/query-client.ts`: shared `QueryClient` factory with project-level defaults
- `src/app/create-router.ts`: creates one TanStack Query client per router instance and wires SSR query hydration through `@tanstack/react-router-ssr-query`

Current server-state workflow notes:

- organization list state is loaded through TanStack Query after authentication and before protected dashboard UI renders
- organization feature query keys and mutations wrap Better Auth organization client APIs rather than using Better Auth hooks as the app data-access layer
- Better Auth-backed reads for current user, organizations, invitations, and members are query-owned through TanStack Query so cache resets and refetches can be coordinated from one place
- query clients are created per router instance to stay compatible with SSR and future request-scoped rendering
- route modules and pages should start consuming TanStack Query only when real server-state behavior is introduced
- post-auth landing resolves from organization membership after current-user refresh, so sign-in and sign-up can send users with organizations to `/dashboard` and organization-less users to `/organizations`

Current auth environment requirements:

- `BETTER_AUTH_SECRET`: required server secret, minimum 32 characters
- `BETTER_AUTH_URL`: required public base URL for Better Auth

Current auth workflow notes:

- email/password auth is enabled as the first backend auth method
- Better Auth's organization plugin is enabled as shared infrastructure, and app-owned organization workflows use client APIs wrapped by TanStack Query
- app-owned auth entry routes now exist at `/sign-in` and `/sign-up`; sign-in and sign-up use reusable TanStack Form UI, refresh the query-owned current-user and organization caches after successful submission, and resolve their landing page from organization membership plus any requested `redirectTo` target
- auth transitions clear the auth query namespace on sign in, sign up, and sign out; organization changes invalidate and rehydrate the auth query namespace so org-scoped queries refetch against the new active organization and the current-user permission payload
- authenticated dashboard chrome now exposes the current signed-in user in a sidebar footer profile menu, includes a settings link in that menu, exposes a dedicated invitations entry for org users, and uses a reusable sign-out confirmation button for session termination
- organization creation is implemented at `/organizations/new` with a TanStack Form UI and a Better Auth organization create mutation
- organization invitations are implemented as a reusable TanStack Form UI around `authClient.organization.inviteMember(...)`, with `/dashboard/members` linking into the dedicated invite page
- organization access now has a dedicated `/organizations` hub for users without organizations, a dedicated `/organizations/invitations` page for their pending invitations, and a dashboard `/dashboard/invitations` page for organization users; the invitation pages list pending user invitations through `authClient.organization.listUserInvitations()`, and accept/reject actions use confirmation dialogs before calling Better Auth invitation mutations
- pending invitation rows prefer the organization name in the primary label and avoid exposing raw organization IDs in normal UI copy
- current authenticated pages use a shared client-side `AuthenticatedRoute` wrapper that shows a loading state while the current-user TanStack Query resolves, redirects unauthenticated users to `/sign-in?redirectTo=...`, only performs organization bootstrap on organization-required routes, and redirects organization members away from `/organizations` to `/dashboard/invitations`
- the organization-access shell provides the non-dashboard chrome for `/organizations`, `/organizations/invitations`, and `/settings`, while `/organizations/new` switches between the access shell and dashboard shell based on organization membership; settings and sign-out stay exposed through the compact profile menu while locale selection stays on the settings page
- `/dashboard/settings` remains nested under the dashboard route tree for URL structure and uses the dashboard shell, while `/settings` uses the organization-access shell for the same page component
- the dashboard sidebar header uses the organization switcher instead of the application name
- the dashboard sidebar now includes an `Invitations` entry that links to `/dashboard/invitations`
- role-aware dashboard navigation and members/role-management actions now use the shared permission helper and `PermissionGate` component instead of inlined permission conditionals
- locale selection now lives on both `/dashboard/settings` and `/settings` instead of the dashboard header
- dynamic per-organization custom roles are stored through Better Auth's `organization_role` table rather than app-owned role tables
- shared baseline organization roles are `owner`, `admin`, and `member`, with additional runtime role management gated by the Better Auth `ac` permission resource; baseline roles are stored as dynamic `organization_role` rows, backfilled by migration, and lazily repaired during current-user role lookup
- the client auth payload now comes from a server-backed current-user query that includes the active organization and active role permissions for client-side authorization checks
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
