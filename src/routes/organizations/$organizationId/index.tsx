import { createFileRoute } from "@tanstack/react-router"

import { OrganizationDetailPage } from "@/pages/organizations/ui/organization-detail-page"
import { AuthenticatedRoute } from "@/shared/auth/ui/authenticated-route"

export const Route = createFileRoute("/organizations/$organizationId/")({
  component: OrganizationDetailPageRoute,
})

function OrganizationDetailPageRoute() {
  const { organizationId } = Route.useParams()

  return (
    <AuthenticatedRoute>
      <OrganizationDetailPage organizationId={organizationId} />
    </AuthenticatedRoute>
  )
}
