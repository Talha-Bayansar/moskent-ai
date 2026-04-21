import { createFileRoute } from "@tanstack/react-router"

import { DashboardPage } from "@/pages/dashboard/ui/dashboard-page"
import { AuthenticatedRoute } from "@/shared/auth/ui/authenticated-route"

export const Route = createFileRoute("/dashboard/")({
  component: DashboardPageRoute,
})

function DashboardPageRoute() {
  return (
    <AuthenticatedRoute>
      <DashboardPage />
    </AuthenticatedRoute>
  )
}
