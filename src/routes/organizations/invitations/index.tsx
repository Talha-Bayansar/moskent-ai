import { createFileRoute } from "@tanstack/react-router"

import { OrganizationsInvitationsPage } from "@/pages/organizations/invitations/ui/invitations-page"
import { AuthenticatedRoute } from "@/shared/auth/ui/authenticated-route"

export const Route = createFileRoute("/organizations/invitations/")({
  component: OrganizationsInvitationsPageRoute,
})

function OrganizationsInvitationsPageRoute() {
  return (
    <AuthenticatedRoute
      requireOrganization={false}
      redirectIfHasOrganizationsTo="/dashboard/invitations"
    >
      <OrganizationsInvitationsPage />
    </AuthenticatedRoute>
  )
}
