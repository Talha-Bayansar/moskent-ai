# Architecture

This file records the current technical shape of the application. It must be updated when implementation changes in ways that affect structure, boundaries, or data flow.

## Current Known Foundation

- Application framework: TanStack Start
- UI foundation: React, TypeScript, shadcn/ui
- Intended server-state layer: TanStack Query
- Intended forms layer: TanStack Form
- Intended database layer: Neon Postgres with Drizzle ORM
- Intended authentication layer: Better Auth

Where code and this file disagree, update this file or resolve the implementation mismatch in the same change.

## App Structure

Current known repository structure:

- `src/routes/`: route definitions and route-facing modules
- `src/components/`: reusable UI components
- `src/components/ui/`: shadcn/ui-based primitives
- `src/lib/`: shared utilities and non-UI modules

Detailed feature/module structure: `TBD`

## Data Flow

Current high-level expectation:

- UI and route modules collect user input
- application logic coordinates structured actions
- persistence flows through Postgres via Drizzle
- auth/session state is managed through Better Auth
- AI-driven workflows will translate natural-language input into structured application operations

Concrete request, mutation, and orchestration flows: `TBD`

## Boundaries

Current intended boundaries:

- route modules should stay thin and focused on request/UI composition
- reusable UI should live separately from feature logic
- shared utilities should not become a catch-all for domain behavior
- auth, data access, and AI orchestration should remain explicit boundaries as they emerge

Concrete package/module boundaries: `TBD`

## Future Architecture Notes

Use this section for short forward-looking notes that are grounded in active work, not speculation.

- AI orchestration boundary: `TBD`
- organization and membership model: `TBD`
- action execution model for structured AI operations: `TBD`
- observability and audit strategy for AI actions: `TBD`

## Maintenance Rule

Update this file when:

- folders or ownership boundaries change
- data flow changes materially
- auth or database integration strategy changes
- new durable architectural patterns are introduced
