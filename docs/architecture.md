# Architecture

This file records the current technical shape of the application. It must be updated when implementation changes in ways that affect structure, boundaries, or data flow.

## Current Known Foundation

- Application framework: TanStack Start
- UI foundation: React, TypeScript, shadcn/ui
- Intended server-state layer: TanStack Query
- Intended forms layer: TanStack Form
- Database layer: Neon Postgres with Drizzle ORM
- Intended authentication layer: Better Auth

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

Current file naming convention:

- authored files and folders use kebab-case
- framework-required/generated names are the only exceptions
- server-only modules use `.server.ts`
- server functions use `.functions.ts`

## Data Flow

Current high-level expectation:

- route modules compose TanStack Router configuration and hand off rendering to page modules
- UI and page modules collect user input
- application logic coordinates structured actions
- persistence flows through Postgres via Drizzle
- auth/session state is managed through Better Auth
- AI-driven workflows will translate natural-language input into structured application operations

Concrete request, mutation, and orchestration flows: `TBD`

## Boundaries

Current intended boundaries:

- route modules stay thin and focused on TanStack Router concerns such as loaders, params, and metadata
- page modules own route-facing UI instead of embedding long-term page components directly in route files
- reusable UI primitives live in `src/shared/ui/`
- shared utilities live in `src/shared/lib/`
- low-level database bootstrap lives in `src/shared/database/`
- entity tables and entity-specific persistence should live in `src/entities/<entity>/` once domain slices are added
- auth, data access, and AI orchestration should remain explicit boundaries as they emerge

Current dependency direction:

- `app -> pages -> widgets -> features -> entities -> shared`
- `shared` must not depend on higher layers
- `entities` may depend only on `shared`
- `routes` are framework adapters over `app` and `pages`, not a general-purpose logic layer

## Future Architecture Notes

Use this section for short forward-looking notes that are grounded in active work, not speculation.

- AI orchestration boundary: `TBD`
- organization and membership model: `TBD`
- action execution model for structured AI operations: `TBD`
- observability and audit strategy for AI actions: `TBD`

## Database Foundation

Current database setup:

- `src/shared/database/env.server.ts`: runtime validation for server database configuration
- `src/shared/database/client.server.ts`: Neon serverless HTTP client wrapped by Drizzle
- `src/shared/database/schema/index.ts`: shared schema aggregation point
- `src/shared/database/migrations/`: committed Drizzle migration output directory
- `drizzle.config.ts`: Drizzle Kit configuration for schema generation and migrations

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
