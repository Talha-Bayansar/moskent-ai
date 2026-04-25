import { createFileRoute } from "@tanstack/react-router"

import { MembersPage } from "@/pages/dashboard/members/ui/members-page"

export const Route = createFileRoute("/dashboard/members/")({
  component: MembersPageRoute,
})

function MembersPageRoute() {
  return <MembersPage />
}
