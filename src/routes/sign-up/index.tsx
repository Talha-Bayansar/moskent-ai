import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"

import { SignUpPage } from "@/pages/sign-up/ui/sign-up-page"

export const Route = createFileRoute("/sign-up/")({
  validateSearch: z.object({
    redirectTo: z.string().optional(),
  }),
  component: SignUpRoute,
})

function SignUpRoute() {
  const { redirectTo } = Route.useSearch()

  return <SignUpPage redirectTo={redirectTo} />
}
