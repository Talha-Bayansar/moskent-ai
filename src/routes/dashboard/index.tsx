import { createFileRoute } from "@tanstack/react-router"

import { DashboardPage } from "@/pages/dashboard/ui/dashboard-page"

export const Route = createFileRoute("/dashboard/")({
  component: DashboardPageRoute,
})

function DashboardPageRoute() {
  return <DashboardPage />
}
