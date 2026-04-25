import { createFileRoute } from "@tanstack/react-router"

import { SettingsPage } from "@/pages/settings/ui/settings-page"
import { AuthenticatedRoute } from "@/shared/auth/ui/authenticated-route"

export const Route = createFileRoute("/dashboard/settings/")({
  component: SettingsPageRoute,
})

function SettingsPageRoute() {
  return (
    <AuthenticatedRoute>
      <SettingsPage />
    </AuthenticatedRoute>
  )
}
