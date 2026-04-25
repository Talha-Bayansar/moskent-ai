import { createFileRoute } from "@tanstack/react-router"

import { InviteMemberPage } from "@/pages/dashboard/members/invite/ui/invite-member-page"

export const Route = createFileRoute("/dashboard/members/invite/")({
  component: InviteMemberPageRoute,
})

function InviteMemberPageRoute() {
  return <InviteMemberPage />
}
