import { createFileRoute } from "@tanstack/react-router"

import { OrganizationDetailPage } from "@/pages/organizations/ui/organization-detail-page"

export const Route = createFileRoute("/organizations/$organizationId/")({
  component: OrganizationDetailPageRoute,
})

function OrganizationDetailPageRoute() {
  const { organizationId } = Route.useParams()

  return <OrganizationDetailPage organizationId={organizationId} />
}
