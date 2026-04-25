import { Outlet, createFileRoute } from "@tanstack/react-router"

import { DashboardShell } from "@/pages/dashboard/ui/dashboard-shell"
import { AuthenticatedRoute } from "@/shared/auth/ui/authenticated-route"

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayoutRoute,
})

function DashboardLayoutRoute() {
  return (
    <AuthenticatedRoute>
      <DashboardShell>
        <Outlet />
      </DashboardShell>
    </AuthenticatedRoute>
  )
}
