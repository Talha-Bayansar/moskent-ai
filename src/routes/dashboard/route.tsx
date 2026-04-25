import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router"

import { DashboardShell } from "@/pages/dashboard/ui/dashboard-shell"
import { AuthenticatedRoute } from "@/shared/auth/ui/authenticated-route"

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayoutRoute,
})

function DashboardLayoutRoute() {
  const location = useLocation()
  const isSettingsRoute = location.pathname.endsWith("/dashboard/settings")

  if (isSettingsRoute) {
    return <Outlet />
  }

  return (
    <AuthenticatedRoute>
      <DashboardShell>
        <Outlet />
      </DashboardShell>
    </AuthenticatedRoute>
  )
}
