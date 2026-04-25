# Decisions

This file is a lightweight decision log.

## What Belongs Here

Record decisions that affect how the project is built or evolves, especially when someone later will ask "why did we do it this way?"

Examples:

- stack choices
- architectural boundaries
- auth or data strategy
- feature-shaping product decisions with lasting technical impact

Do not log routine implementation details or every refactor.

## Decision Entry Template

Use this template for new entries:

```md
## YYYY-MM-DD - Decision title

- Status: proposed | accepted | superseded
- Context: what problem or constraint existed
- Decision: what was chosen
- Why: why this option was selected
- Impact: what this changes or constrains
- Follow-up: optional next step or `TBD`
```

## Current Decisions

## 2026-04-25 - Authenticated workspace UI is mobile-first

- Status: accepted
- Context: the application is expected to be used mainly on mobile and may become installable as a PWA later.
- Decision: treat mobile as the primary layout baseline for authenticated workspace surfaces, with drawer navigation, compact app headers, safe-area-aware spacing, and desktop sidebar behavior only as the larger-screen adaptation.
- Why: the core AI workspace should feel like an app on phones instead of a desktop dashboard scaled down to a narrow viewport.
- Impact: future dashboard routes and shared authenticated chrome should be checked against phone-sized viewports first and avoid interactions that require laptop-width layout.
- Follow-up: real PWA installation behavior remains `TBD`.

## 2026-04-25 - Authenticated dashboard is the initial AI interaction surface

- Status: accepted
- Context: the product direction centers on organization-aware natural-language interaction, and authenticated dashboard routes already bootstrap the active organization before rendering protected UI.
- Decision: use `/dashboard` as the first chat-like AI workspace surface instead of making the public root page the primary interaction point.
- Why: future AI requests depend on signed-in user identity, active organization context, and permission-aware behavior, which belong behind the authenticated application shell.
- Impact: the dashboard landing page should evolve toward the connected AI workflow while AI orchestration, action execution, persistence, and detailed permission behavior remain explicit `TBD` boundaries.
- Follow-up: define the AI orchestration contract and action execution model before enabling message submission.

## 2026-04-24 - Active organization is bootstrapped before dashboard render

- Status: accepted
- Context: protected dashboard UI needs app-wide organization context immediately after authentication.
- Decision: load the authenticated user's Better Auth organizations through TanStack Query, redirect users without organizations to `/organizations/new`, and set the first returned organization as the Better Auth active organization when the session has none.
- Why: this keeps organization context available before dashboard children render without introducing app-owned organization state separate from Better Auth.
- Impact: protected dashboard flows should read active organization from the Better Auth session and use the organizations feature query/mutation wrappers for list and switch behavior.
- Follow-up: define route structure and authorization behavior for organization-scoped product pages once those workflows exist.

## 2026-04-21 - Organization roles and permissions are owned by Better Auth's organization plugin

- Status: accepted
- Context: the project needs organization-aware auth infrastructure and dynamic per-organization roles before product workflows and UI are defined.
- Decision: enable Better Auth's organization plugin with dynamic access control, keep `owner` / `admin` / `member` as the shared baseline roles, and store per-organization custom role permissions in Better Auth's generated `organization_role` table.
- Why: this provides an organization-aware auth foundation without inventing parallel app-owned ACL tables before the product model is stable.
- Impact: shared auth config owns the permission catalog and baseline roles, auth schema generation now includes organization-related tables, and future feature work should build on Better Auth's organization APIs instead of introducing a second role system by default.
- Follow-up: decide later which domain resources beyond organization management should be added to the shared permission catalog.

## 2026-04-21 - TanStack Start is the application foundation

- Status: accepted
- Context: the project needs a full-stack React foundation that supports iterative product development.
- Decision: use TanStack Start as the application foundation.
- Why: it fits the current React-based direction and leaves room for route, server, and application evolution during discovery.
- Impact: route structure and full-stack application patterns should align with TanStack Start conventions.
- Follow-up: document project-specific route and server patterns as they become stable.

## 2026-04-21 - shadcn/ui is the UI component foundation

- Status: accepted
- Context: the project needs a reusable component base without committing early to a large custom design system.
- Decision: use shadcn/ui as the UI component foundation.
- Why: it supports direct ownership of component code and incremental UI evolution.
- Impact: reusable UI should build on the established shared UI layer and related conventions.
- Follow-up: document additional UI conventions only when they become durable.

## 2026-04-21 - Form, query, auth, and database direction are part of the initial stack

- Status: accepted
- Context: the project already has a known application direction beyond the starter setup.
- Decision: TanStack Query, TanStack Form, Better Auth, Neon Postgres, and Drizzle ORM are part of the intended project foundation.
- Why: these choices align with the current full-stack product direction and expected application needs.
- Impact: architecture and implementation work should assume these technologies unless an explicit decision changes them.
- Follow-up: document concrete integration patterns once they exist in the implementation.

## 2026-04-21 - Feature-sliced design is the default source architecture

- Status: accepted
- Context: the starter structure was too flat to express durable boundaries between route adapters, pages, shared infrastructure, and future domain slices.
- Decision: adopt a feature-sliced architecture centered on `app`, `pages`, `widgets`, `features`, `entities`, and `shared`, while keeping `src/routes/` as the TanStack Start framework entry layer.
- Why: this keeps framework concerns explicit without letting route files become the long-term home for page UI, feature logic, or shared infrastructure.
- Impact: new code should follow the FSD layer direction and route files should stay thin adapters over `app` and `pages`.
- Follow-up: add concrete entity and feature slices as the domain model becomes real.

## 2026-04-21 - TanStack routes use folder-based entries with kebab-case naming

- Status: accepted
- Context: the project needed a routing convention that scales to nested routes while staying consistent with the repo-wide naming rule.
- Decision: concrete TanStack routes use folder-based entries with `index.tsx`, and authored files/folders use kebab-case unless the framework or generator requires an exception.
- Why: folder-per-route structure keeps nested route ownership clear and aligns route naming with the broader repository convention.
- Impact: route additions should prefer `src/routes/<segment>/index.tsx` and dynamic segments should use TanStack param folders such as `$organizationId` because TanStack requires param names to be valid JavaScript identifiers.
- Follow-up: use `.lazy.tsx` companions only when route-level code splitting becomes useful.

## 2026-04-21 - Neon serverless HTTP plus Drizzle is the initial database integration pattern

- Status: accepted
- Context: the project needs a database foundation that works with the current stack and does not bias the implementation toward a Node-only runtime.
- Decision: use `@neondatabase/serverless` with Drizzle's Neon HTTP adapter, with shared bootstrap/config in `src/shared/database/` and entity-owned schema modules to follow later.
- Why: this keeps the first database setup compatible with Cloudflare-style runtimes while isolating the connection strategy behind a server-only module.
- Impact: database access should flow through server-only shared infrastructure, and real tables should be introduced from entity slices rather than a central catch-all data layer.
- Follow-up: add the first real entity schema and migration once the initial persistent domain slice is accepted.

## 2026-04-21 - Better Auth lives in a shared auth boundary with committed generated schema

- Status: accepted
- Context: the project needed a backend auth foundation without adding UI yet, while keeping auth schema changes visible in the same workflow as the rest of the database.
- Decision: place the Better Auth server/client/bootstrap code under `src/shared/auth/`, mount its handler through TanStack Start at `/api/auth/*`, commit the generated Drizzle auth schema, and generate SQL migrations through the existing Drizzle workflow.
- Why: this keeps auth as an explicit shared infrastructure boundary, avoids hiding required tables behind runtime-only setup, and gives future contributors one documented place to update auth config and schema generation.
- Impact: Better Auth config changes should be followed by `pnpm auth:generate`, and resulting schema changes should be turned into committed Drizzle migrations with `pnpm db:generate`.
- Follow-up: add session access patterns, organization-aware route protection conventions, and auth UI once authenticated application flows exist.

## 2026-04-23 - Organization creation uses a TanStack Query mutation around the Better Auth client API

- Status: accepted
- Context: the project needed a first organization workflow, and the repo direction now prefers TanStack Query for data access while avoiding Better Auth hooks for queries.
- Decision: implement organization creation in a dedicated feature slice, call `authClient.organization.create(...)` directly from a TanStack Query mutation, and use TanStack Form for the UI state and validation.
- Why: this keeps write logic explicit, avoids introducing Better Auth hooks as the data-access layer, and fits the repo's intended query/mutation boundaries.
- Impact: organization creation should be modeled as a client mutation with TanStack Query, while future Better Auth or Drizzle reads should use client/server calls wrapped by TanStack Query rather than Better Auth hooks.
- Follow-up: define the read-side organization query pattern when the UI needs organization listings or selection.

## 2026-04-21 - Paraglide JS is the initial i18n solution with English at the root URL

- Status: accepted
- Context: the application needs first-class multilingual support for English, Dutch, and Turkish in a TanStack Start app with SSR and locale-aware URLs.
- Decision: use Paraglide JS as the i18n layer, keep English as the base locale at unprefixed URLs, prefix Dutch and Turkish URLs, and resolve locales in the order `url -> cookie -> preferredLanguage -> baseLocale`.
- Why: Paraglide matches TanStack Start's routing model, provides typed messages plus SSR middleware, and supports localized URLs without duplicating route files.
- Impact: UI copy should move to Paraglide message functions, router/server setup must keep Paraglide rewrite and middleware in sync, and `/api/*` routes stay excluded from locale routing.
- Follow-up: decide later whether route slugs themselves should become localized beyond locale prefixes.

## Rule

Every entry should explain `why`, not only `what`.
