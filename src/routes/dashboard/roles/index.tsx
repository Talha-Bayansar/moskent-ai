import { createFileRoute } from "@tanstack/react-router"

import { RolesPage } from "@/pages/dashboard/roles/ui/roles-page"

export const Route = createFileRoute("/dashboard/roles/")({
  component: RolesPageRoute,
})

function RolesPageRoute() {
  return <RolesPage />
}
