import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { UserShield01Icon } from "@hugeicons/core-free-icons"
import { Link } from "@tanstack/react-router"

import type { OrganizationRoleSummary } from "@/features/organizations/roles/model/types"
import { OrganizationRolesPageContent } from "@/features/organizations/roles/ui/organization-roles-page-content"
import { useDeleteOrganizationRoleMutation } from "@/features/organizations/roles/model/mutations"
import { PermissionGate } from "@/shared/auth/ui/permission-gate"
import { useCurrentUserQuery } from "@/shared/auth/model/current-user"
import { m } from "@/shared/i18n"
import { Button } from "@/shared/ui/button"
import { DeleteConfirmationDialog } from "@/shared/ui/delete-confirmation-dialog"

type DeleteRoleState = {
  role: OrganizationRoleSummary
}

export function RolesPage() {
  const currentUserState = useCurrentUserQuery()
  const organizationId =
    currentUserState.data?.session.activeOrganizationId ?? null
  const [deleteState, setDeleteState] = useState<DeleteRoleState | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const deleteRoleMutation = useDeleteOrganizationRoleMutation()

  return (
    <>
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
        onDeleteRole={(role) => {
          setDeleteError(null)
          setDeleteState({ role })
        }}
      />

      <DeleteConfirmationDialog
        open={Boolean(deleteState)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteState(null)
            setDeleteError(null)
            deleteRoleMutation.reset()
          }
        }}
        onConfirm={async () => {
          if (!deleteState || !organizationId) {
            return
          }

          setDeleteError(null)

          try {
            await deleteRoleMutation.mutateAsync({
              organizationId,
              roleId: deleteState.role.id,
            })

            setDeleteState(null)
            deleteRoleMutation.reset()
          } catch (error) {
            setDeleteError(
              error instanceof Error ? error.message : m.roles_delete_generic_error()
            )
          }
        }}
        title={
          deleteState
            ? m.roles_delete_confirm_title({
                role: deleteState.role.role,
              })
            : m.roles_delete_confirm_title({ role: "" })
        }
        description={
          deleteState
            ? m.roles_delete_confirm_description({
                role: deleteState.role.role,
              })
            : m.roles_delete_confirm_description({ role: "" })
        }
        confirmLabel={m.roles_delete_confirm_label()}
        submittingLabel={m.roles_delete_confirm_submitting()}
        cancelLabel={m.organization_invitations_cancel()}
        error={deleteError}
        isPending={deleteRoleMutation.isPending}
      />
    </>
  )
}
