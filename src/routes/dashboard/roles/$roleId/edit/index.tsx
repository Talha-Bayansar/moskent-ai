import { createFileRoute } from "@tanstack/react-router"

import { UpdateRolePage } from "@/pages/dashboard/roles/edit/ui/update-role-page"

export const Route = createFileRoute("/dashboard/roles/$roleId/edit/")({
  component: UpdateRolePageRoute,
})

function UpdateRolePageRoute() {
  const { roleId } = Route.useParams()

  return <UpdateRolePage roleId={roleId} />
}
