import { createFileRoute } from "@tanstack/react-router"

import { DashboardInvitationsPage } from "@/pages/dashboard/invitations/ui/invitations-page"

export const Route = createFileRoute("/dashboard/invitations/")({
  component: DashboardInvitationsPageRoute,
})

function DashboardInvitationsPageRoute() {
  return <DashboardInvitationsPage />
}
