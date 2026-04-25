# Project Overview

## Purpose

This repository is the starting point for an AI-driven organizational platform.

The high-level product direction is:

- users belong to organizations
- users interact with AI through natural language
- the AI performs structured actions on organizational data
- initial language focus is Turkish

This description should stay minimal and factual. It must reflect reality, not assumptions.

## Current State

- Early-stage project in discovery
- MVP boundaries are not fully defined
- Product workflows and domain model are still evolving
- Current repository still resembles a starter application in some areas
- The authenticated app now splits into a header-only organization-access flow for users without organizations and a sidebar dashboard flow for users with organizations
- The organization-access hub is an onboarding entry point, while invitations now live on a dedicated `/organizations/invitations` route
- The dashboard remains the starting point for organization users and includes a create-organization action in the organization selector

## Current Technical Foundation

Known foundation for the project:

- TanStack Start
- TanStack Query
- TanStack Form
- shadcn/ui
- Neon (Postgres)
- Drizzle ORM
- Better Auth

Note: some of this stack may still be partially integrated in the codebase. Keep this file aligned with actual project direction and update it when planned foundations change.

## Known Goals

- Build an organization-aware application foundation
- Enable natural-language interaction with AI
- Translate AI input into structured application actions
- Evolve the product iteratively through discovery rather than fixed upfront scope

## Known Unknowns

- Exact MVP scope: `TBD`
- Initial domain model beyond organizations, users, and structured actions: `TBD`
- Final architecture for AI orchestration and tool execution: `TBD`
- Detailed permissions and multi-organization behavior: `TBD`
- Production deployment topology: `TBD`

## Maintenance Rule

Update this file when any of the following changes:

- project direction
- confirmed tech stack
- current stage of product definition
- major goals or major unknowns
