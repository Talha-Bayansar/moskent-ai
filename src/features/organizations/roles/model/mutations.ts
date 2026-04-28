import { useMutation, useQueryClient } from "@tanstack/react-query"

import { organizationRoleKeys } from "./queries"
import {
  type CreateRoleInput,
  createRoleSchema,
  normalizeRoleName,
  normalizeRolePermissionMap,
} from "./schema"
import { authClient } from "@/shared/auth/model/auth-client"
import { m } from "@/shared/i18n"

type CreateOrganizationRoleMutationOptions = {
  onSuccess?: () => void
}

export function useCreateOrganizationRoleMutation(
  organizationId: string | null,
  options?: CreateOrganizationRoleMutationOptions
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateRoleInput) => {
      const parsed = createRoleSchema.parse({
        role: normalizeRoleName(input.role),
        permission: normalizeRolePermissionMap(input.permission),
      })

      if (!organizationId) {
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
