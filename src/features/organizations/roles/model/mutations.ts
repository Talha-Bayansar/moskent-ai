import { useMutation, useQueryClient } from "@tanstack/react-query"

import {
  createRoleSchema,
  normalizeRoleName,
  normalizeRolePermissionMap,
  updateRoleSchema,
} from "./schema"
import { organizationRoleKeys } from "./queries"
import type { CreateRoleInput } from "./schema"
import { revalidateSignedInAuthState } from "@/shared/auth/model/auth-cache"
import { useCurrentUserQuery } from "@/shared/auth/model/current-user"
import { authClient } from "@/shared/auth/model/auth-client"
import { hasPermission } from "@/shared/auth/model/permission-checks"
import { m } from "@/shared/i18n"

type CreateOrganizationRoleMutationOptions = {
  onSuccess?: () => void
}

type UpdateOrganizationRoleMutationOptions = {
  onSuccess?: () => void
}

type DeleteOrganizationRoleMutationOptions = {
  onSuccess?: () => void
}

type UpdateOrganizationRoleInput = {
  organizationId: string | null
  roleId: string
  permission: Record<string, Array<string>>
}

type DeleteOrganizationRoleInput = {
  organizationId: string | null
  roleId: string
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

export function useUpdateOrganizationRoleMutation(
  options?: UpdateOrganizationRoleMutationOptions
) {
  const queryClient = useQueryClient()
  const currentUserState = useCurrentUserQuery()

  return useMutation({
    mutationFn: async (input: UpdateOrganizationRoleInput) => {
      const parsed = updateRoleSchema.parse({
        permission: normalizeRolePermissionMap(input.permission),
      })

      const rolePermissions =
        currentUserState.data?.activeOrganizationRole?.permission ?? null

      if (
        !input.organizationId ||
        !hasPermission(rolePermissions, "ac", "update")
      ) {
        throw new Error(m.roles_update_no_access_description())
      }

      const { data, error } = await authClient.organization.updateRole({
        roleId: input.roleId,
        organizationId: input.organizationId,
        data: {
          permission: parsed.permission,
        },
      })

      if (error) {
        throw new Error(error.message ?? m.roles_update_generic_error())
      }

      return data
    },
    onSuccess: async () => {
      await revalidateSignedInAuthState(queryClient)

      await queryClient.invalidateQueries({
        queryKey: organizationRoleKeys.all,
      })

      options?.onSuccess?.()
    },
  })
}

export function useDeleteOrganizationRoleMutation(
  options?: DeleteOrganizationRoleMutationOptions
) {
  const queryClient = useQueryClient()
  const currentUserState = useCurrentUserQuery()

  return useMutation({
    mutationFn: async (input: DeleteOrganizationRoleInput) => {
      const rolePermissions =
        currentUserState.data?.activeOrganizationRole?.permission ?? null

      if (
        !input.organizationId ||
        !hasPermission(rolePermissions, "ac", "delete")
      ) {
        throw new Error(m.roles_delete_no_access_description())
      }

      const { data, error } = await authClient.organization.deleteRole({
        roleId: input.roleId,
        organizationId: input.organizationId,
      })

      if (error) {
        throw new Error(error.message ?? m.roles_delete_generic_error())
      }

      return data
    },
    onSuccess: async () => {
      await revalidateSignedInAuthState(queryClient)

      await queryClient.invalidateQueries({
        queryKey: organizationRoleKeys.all,
      })

      options?.onSuccess?.()
    },
  })
}
