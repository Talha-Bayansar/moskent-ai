import { HugeiconsIcon } from "@hugeicons/react"
import { UserShield01Icon } from "@hugeicons/core-free-icons"
import { Link } from "@tanstack/react-router"

import { OrganizationRolesPageContent } from "@/features/organizations/roles/ui/organization-roles-page-content"
import { PermissionGate } from "@/shared/auth/ui/permission-gate"
import { m } from "@/shared/i18n"
import { Button } from "@/shared/ui/button"

export function RolesPage() {
  return (
    <OrganizationRolesPageContent
      headerAction={
        <PermissionGate resource="ac" action="create">
          <Button
            className="w-full sm:w-auto"
            render={<Link to="/dashboard/roles/new" />}
          >
            <HugeiconsIcon
              icon={UserShield01Icon}
              strokeWidth={2}
              data-icon="inline-start"
            />
            {m.roles_create_action()}
          </Button>
        </PermissionGate>
      }
    />
  )
}
