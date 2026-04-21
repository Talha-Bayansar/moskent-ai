# Docs

This folder holds the durable project documentation for the repository.

## Purpose

- Keep project context visible for both humans and coding agents.
- Separate product, architecture, decisions, and feature state into focused files.
- Make updates easy without introducing heavy process.

## Current Structure

- [project-overview.md](project-overview.md): project purpose, stage, goals, and known unknowns
- [architecture.md](architecture.md): current technical foundation, structure, and boundaries
- [decisions.md](decisions.md): lightweight decision log with rationale
- [features.md](features.md): high-level feature register and status

## Philosophy

- Keep docs modular.
- Keep files small and specific.
- Update the smallest file that owns the changed truth.
- Prefer links between docs over repeating the same information.

## How To Add New Documentation

Add a new file only when:

- an existing file is becoming hard to scan
- a topic has become durable and deserves its own owner
- the topic will be updated independently over time

When adding a file:

1. Give it one clear responsibility.
2. Add it to this index.
3. Avoid copying content from another doc. Link instead.

## Keep Docs Lean

- Record reality, decisions, constraints, and open questions.
- Use `TBD` for undecided items.
- Avoid speculative architecture and feature detail.
- Remove or rewrite stale text instead of layering new text on top of it.

Rule: these docs should reflect the current project, not the version someone hoped to build.
