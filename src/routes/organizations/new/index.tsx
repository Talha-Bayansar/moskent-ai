import { createFileRoute } from "@tanstack/react-router"

import { CreateOrganizationPage } from "@/pages/organizations/ui/create-organization-page"
import { AuthenticatedRoute } from "@/shared/auth/ui/authenticated-route"

export const Route = createFileRoute("/organizations/new/")({
  component: CreateOrganizationPageRoute,
})

function CreateOrganizationPageRoute() {
  return (
    <AuthenticatedRoute requireOrganization={false}>
      <CreateOrganizationPage />
    </AuthenticatedRoute>
  )
}
