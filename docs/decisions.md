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
- Impact: reusable UI should build on the established `src/components/ui/` layer and related conventions.
- Follow-up: document additional UI conventions only when they become durable.

## 2026-04-21 - Form, query, auth, and database direction are part of the initial stack

- Status: accepted
- Context: the project already has a known application direction beyond the starter setup.
- Decision: TanStack Query, TanStack Form, Better Auth, Neon Postgres, and Drizzle ORM are part of the intended project foundation.
- Why: these choices align with the current full-stack product direction and expected application needs.
- Impact: architecture and implementation work should assume these technologies unless an explicit decision changes them.
- Follow-up: document concrete integration patterns once they exist in the implementation.

## Rule

Every entry should explain `why`, not only `what`.
