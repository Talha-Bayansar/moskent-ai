import { createFileRoute } from "@tanstack/react-router"

import { SettingsPage } from "@/pages/settings/ui/settings-page"

export const Route = createFileRoute("/dashboard/settings/")({
  component: SettingsPageRoute,
})

function SettingsPageRoute() {
  return <SettingsPage />
}
