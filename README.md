# Moskent AI

This repository uses TanStack Start with a feature-sliced source structure.

## Source layout

- `src/routes/`: TanStack route adapters
- `src/pages/`: page UI owned outside the routing layer
- `src/shared/ui/`: shared UI primitives
- `src/shared/database/`: Neon + Drizzle foundation

## Database scripts

Run the database tooling with:

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:studio
```

Set `DATABASE_URL` in your local environment before using the Drizzle scripts.

## Adding shadcn/ui components

Generated shared primitives should live under `src/shared/ui/`. Update `components.json` aliases if the shadcn CLI needs to be rerun.

## Using shared UI

```tsx
import { Button } from "@/shared/ui/button"
```
