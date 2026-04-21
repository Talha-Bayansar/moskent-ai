import { createFileRoute } from "@tanstack/react-router"

import { SignOutPage } from "@/pages/sign-out/ui/sign-out-page"

export const Route = createFileRoute("/sign-out/")({
  component: SignOutPage,
})
