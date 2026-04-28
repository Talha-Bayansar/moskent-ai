import { createFileRoute } from "@tanstack/react-router"

import { CreateRolePage } from "@/pages/dashboard/roles/new/ui/create-role-page"

export const Route = createFileRoute("/dashboard/roles/new/")({
  component: CreateRolePageRoute,
})

function CreateRolePageRoute() {
  return <CreateRolePage />
}
