import { createFileRoute } from "@tanstack/react-router"

import { SettingsPage } from "@/pages/settings/ui/settings-page"
import { AuthenticatedRoute } from "@/shared/auth/ui/authenticated-route"
import { OrganizationAccessShell } from "@/shared/auth/ui/organization-access-shell"

export const Route = createFileRoute("/dashboard/settings/")({
  component: SettingsPageRoute,
})

function SettingsPageRoute() {
  return (
    <AuthenticatedRoute requireOrganization={false}>
      <OrganizationAccessShell>
        <SettingsPage />
      </OrganizationAccessShell>
    </AuthenticatedRoute>
  )
}
