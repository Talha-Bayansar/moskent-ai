import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"

import { SignInPage } from "@/pages/sign-in/ui/sign-in-page"

export const Route = createFileRoute("/sign-in/")({
  validateSearch: z.object({
    redirectTo: z.string().optional(),
  }),
  component: SignInRoute,
})

function SignInRoute() {
  const { redirectTo } = Route.useSearch()

  return <SignInPage redirectTo={redirectTo} />
}
