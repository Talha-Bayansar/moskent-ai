import { createFileRoute } from "@tanstack/react-router"

import { UpdateMemberPage } from "@/pages/dashboard/members/edit/ui/update-member-page"

export const Route = createFileRoute("/dashboard/members/$memberId/edit/")({
  component: UpdateMemberPageRoute,
})

function UpdateMemberPageRoute() {
  const { memberId } = Route.useParams()

  return <UpdateMemberPage memberId={memberId} />
}
