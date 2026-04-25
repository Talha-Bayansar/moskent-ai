import { createFileRoute } from "@tanstack/react-router"

import { OrganizationsHubPage } from "@/pages/organizations/ui/organizations-hub-page"
import { AuthenticatedRoute } from "@/shared/auth/ui/authenticated-route"

export const Route = createFileRoute("/organizations/")({
  component: OrganizationsHubPageRoute,
})

function OrganizationsHubPageRoute() {
  return (
    <AuthenticatedRoute
      requireOrganization={false}
      redirectIfHasOrganizationsTo="/dashboard"
    >
      <OrganizationsHubPage />
    </AuthenticatedRoute>
  )
}
