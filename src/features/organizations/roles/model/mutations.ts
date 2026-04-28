import { useMutation, useQueryClient } from "@tanstack/react-query"

import { organizationRoleKeys } from "./queries"
import { createRoleSchema, normalizeRoleName, normalizeRolePermissionMap } from "./schema"
import { useCurrentUserQuery } from "@/shared/auth/model/current-user"
import { authClient } from "@/shared/auth/model/auth-client"
import { hasPermission } from "@/shared/auth/model/permission-checks"
import { m } from "@/shared/i18n"
import type { CreateRoleInput } from "./schema"

type CreateOrganizationRoleMutationOptions = {
  onSuccess?: () => void
}

export function useCreateOrganizationRoleMutation(
  organizationId: string | null,
  options?: CreateOrganizationRoleMutationOptions
) {
  const queryClient = useQueryClient()
  const currentUserState = useCurrentUserQuery()

  return useMutation({
    mutationFn: async (input: CreateRoleInput) => {
      const parsed = createRoleSchema.parse({
        role: normalizeRoleName(input.role),
        permission: normalizeRolePermissionMap(input.permission),
      })

      const rolePermissions =
        currentUserState.data?.activeOrganizationRole?.permission ?? null

      if (!organizationId || !hasPermission(rolePermissions, "ac", "create")) {
        throw new Error(m.roles_create_no_access_description())
      }

      const { data, error } = await authClient.organization.createRole({
        role: parsed.role,
        permission: parsed.permission,
        organizationId,
      })

      if (error) {
        throw new Error(error.message ?? m.roles_create_generic_error())
      }

      return data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: organizationRoleKeys.all,
      })

      options?.onSuccess?.()
    },
  })
}
