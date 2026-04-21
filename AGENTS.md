# AGENTS.md

This file is the entry point for coding agents and contributors working in this repository.

## Project Stage

- This project is early-stage and still in discovery.
- Product scope, feature boundaries, and architecture are intentionally incomplete.
- Prefer documenting reality and open questions over filling gaps with assumptions.
- Use `TBD` when a decision has not been made yet.

## Current Project Context

- Repository foundation currently includes TanStack Start, React, TypeScript, and shadcn/ui.
- The intended application direction also includes TanStack Query, TanStack Form, Neon (Postgres), Drizzle ORM, and Better Auth.
- The product direction is an AI-driven organizational platform where users belong to organizations and interact with AI through natural language, initially with Turkish-focused usage.
- The implementation is expected to evolve iteratively. Do not treat early structure as final architecture.

## Read Before Change

Use this order before making material changes:

1. Read this file.
2. Read [docs/README.md](docs/README.md).
3. Read [docs/project-overview.md](docs/project-overview.md).
4. Read the most relevant focused doc:
   - [docs/architecture.md](docs/architecture.md) for structure, boundaries, and implementation shape
   - [docs/decisions.md](docs/decisions.md) for decisions and rationale
   - [docs/features.md](docs/features.md) for feature scope and status
5. Read the code you will change and the nearest related modules.

If code and docs disagree, treat the code as implementation truth and update the docs in the same change unless the code is known to be wrong.

## Update After Change

Every meaningful change must include the documentation update decision:

1. Check whether the change affects project context, architecture, decisions, or feature status.
2. Update the smallest relevant doc file.
3. If no doc update is needed, verify why:
   - purely internal refactor with no behavior, boundary, or workflow change
   - test-only change
   - formatting or naming cleanup with no decision impact
4. Do not leave known doc drift for later unless explicitly requested.

## Source Of Truth

Use one primary file per concern.

- `AGENTS.md`
  - Agent and contributor workflow
  - Documentation rules
  - Repo-wide operating conventions
- `docs/project-overview.md`
  - What the project is
  - What it is trying to become
  - Current stage, goals, and known unknowns
- `docs/architecture.md`
  - Current technical foundation
  - App structure, boundaries, and data flow
  - Architecture notes that reflect current implementation
- `docs/decisions.md`
  - Important decisions and why they were made
- `docs/features.md`
  - High-level feature areas and current status
- Code
  - Final truth for implementation details not yet documented

Avoid duplicating the same statement across files. Link to the owning file instead.

## Documentation Rules

- Keep docs small, specific, and current.
- Prefer updating an existing file over creating a new one.
- Add a new file only when a topic no longer fits cleanly in the current structure.
- Write facts, decisions, and constraints. Avoid aspirational detail without a decision.
- Use `TBD` instead of guessing.
- Record why a decision exists, not just what was chosen.
- If a temporary note becomes durable project knowledge, move it into `docs/`.

## Documentation Update Triggers

Update docs when any of the following changes:

- product direction or scope
- core user workflow
- feature status
- repository structure or ownership
- app boundaries or data flow
- auth, database, or external service strategy
- key library adoption or removal
- conventions that other contributors or agents must follow

## Change Guidance

### Feature Work

- Check `docs/features.md` before adding or expanding a feature area.
- If the work introduces or materially changes behavior, update feature status.
- If the work changes product understanding, update `docs/project-overview.md`.
- If the work adds a durable technical pattern, update `docs/architecture.md` or `docs/decisions.md`.

### Refactoring

- Update `docs/architecture.md` when boundaries, folders, data flow, or technical responsibilities change.
- Add a decision log entry only if the refactor reflects a real architectural decision, not routine cleanup.

### Architecture Changes

- Update `docs/architecture.md` in the same change.
- If the change was a deliberate tradeoff, add a decision entry with rationale.
- Mark superseded assumptions clearly instead of leaving conflicting text behind.

### Product Decisions

- Update `docs/project-overview.md` when the project direction changes.
- Update `docs/features.md` when the decision changes the active feature surface.
- Record major decisions and rationale in `docs/decisions.md`.

## Handling Unknowns

- Use `TBD` for undecided items.
- Keep `TBD` statements concrete enough to be actionable.
- Do not hide uncertainty behind vague wording.
- When resolving a `TBD`, replace it directly instead of adding a conflicting note elsewhere.

## Repository Conventions

- Prefer small, focused docs over broad narrative documents.
- Prefer file-local clarity over cross-repo duplication.
- Keep top-level project docs limited. `docs/` is the main durable documentation area.
- When adding new documentation, choose names by concern, not by team or date.
- Generated files should not become the only place important project knowledge lives.

## Skills

This repository includes installed skills under `.agents/skills/`. Use them selectively when they improve correctness.

Relevant current skills:

- `tanstack-start-best-practices`
  - Use for route structure, server/client boundaries, middleware, SSR, and overall app organization decisions.
- `tanstack-query-best-practices`
  - Use when documenting or implementing server-state patterns, caching, hydration, and query ownership.
- `tanstack-form`
  - Use when documenting or implementing form state, validation, and submission patterns.
- `better-auth-best-practices`
  - Use when documenting or implementing authentication, sessions, and auth-related environment requirements.
- `shadcn`
  - Use when documenting or implementing UI component conventions and repository UI composition patterns.

Rules for skill use:

- Do not apply every available skill by default.
- Use a skill only when it changes the quality or correctness of the work.
- If a skill affects conventions or structure, reflect that in docs that other agents will read.
- Treat skill guidance as implementation guidance, not product truth.

## Adding Documentation Later

Add a new file only if one of these becomes large enough to justify its own document:

- deployment or environment setup
- contributor workflow
- API contracts
- data model/domain model
- integration-specific guidance

When adding a file:

1. Give it a single clear responsibility.
2. Add it to [docs/README.md](docs/README.md).
3. Update this file only if the new doc becomes part of the standard read-before-change flow.
