# Features

This file is the high-level feature register for the project.

## Status Markers

- `proposed`
- `in progress`
- `implemented`
- `deprecated`

Keep entries high-level. Do not invent detailed product scope here.

## Feature Areas

| Feature Area | Status | Notes |
| --- | --- | --- |
| Organization and user foundation | in progress | Better Auth backend foundation now includes email/password, the organization plugin, dynamic per-organization roles, organization creation at `/organizations/new`, authenticated organization bootstrap, a dashboard organization switcher, an authenticated profile menu with reusable sign-out confirmation, and a dashboard settings page for user preferences. Broader organization management workflows and UI are still `TBD`. |
| Authentication entry UI | implemented | Reusable sign-in and sign-up routes now use TanStack Form with Zod validation and minimal centered page shells. |
| Multilingual interface | implemented | Paraglide JS now provides English, Dutch, and Turkish UI copy with locale-aware routing. The locale picker is surfaced from authenticated user settings instead of the dashboard header. Localized route slugs beyond the locale prefix are still `TBD`. |
| Natural-language AI interaction | in progress | The authenticated `/dashboard` route now presents a chat-like AI workspace shell. Real AI orchestration, message persistence, and interaction model are still `TBD`. |
| Structured action execution | proposed | AI is expected to perform structured application actions. Exact action catalog is `TBD`. |
| Activity and relationship management | proposed | Example direction includes activities and linked contacts, but concrete scope is `TBD`. |

## Rule

Update this file when:

- a feature area is added, removed, or renamed
- a feature status changes
- a product decision materially changes scope

This file must evolve with the product. If something is not decided, mark it as `TBD` instead of inventing detail.
