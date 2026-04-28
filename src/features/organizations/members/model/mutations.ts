import { useMutation, useQueryClient } from "@tanstack/react-query"

import { organizationMemberKeys } from "./queries"
import { revalidateSignedInAuthState } from "@/shared/auth/model/auth-cache"
import { useCurrentUserQuery } from "@/shared/auth/model/current-user"
import { authClient } from "@/shared/auth/model/auth-client"
import { hasPermission } from "@/shared/auth/model/permission-checks"
import { m } from "@/shared/i18n"

type OrganizationMemberMutationOptions = {
  onSuccess?: (member: unknown) => void
}

type UpdateMemberInput = {
  organizationId: string | null
  memberId: string
  role: string | Array<string>
}

type RemoveMemberInput = {
  organizationId: string | null
  memberIdOrEmail: string
}

export function useUpdateOrganizationMemberMutation(
  options?: OrganizationMemberMutationOptions
) {
  const queryClient = useQueryClient()
  const currentUserState = useCurrentUserQuery()

  return useMutation({
    mutationFn: async (input: UpdateMemberInput) => {
      const rolePermissions =
        currentUserState.data?.activeOrganizationRole?.permission ?? null

      if (
        !input.organizationId ||
        !hasPermission(rolePermissions, "member", "update")
      ) {
        throw new Error(membersPermissionError("update"))
      }

      const { data, error } = await authClient.organization.updateMemberRole({
        organizationId: input.organizationId,
        memberId: input.memberId,
        role: input.role,
      })

      if (error) {
        throw new Error(error.message ?? m.members_edit_generic_error())
      }

      return data
    },
    onSuccess: async (member) => {
      await revalidateSignedInAuthState(queryClient)

      await queryClient.invalidateQueries({
        queryKey: organizationMemberKeys.all,
      })

      options?.onSuccess?.(member)
    },
  })
}

export function useRemoveOrganizationMemberMutation(
  options?: OrganizationMemberMutationOptions
) {
  const queryClient = useQueryClient()
  const currentUserState = useCurrentUserQuery()

  return useMutation({
    mutationFn: async (input: RemoveMemberInput) => {
      const rolePermissions =
        currentUserState.data?.activeOrganizationRole?.permission ?? null

      if (
        !input.organizationId ||
        !hasPermission(rolePermissions, "member", "delete")
      ) {
        throw new Error(membersPermissionError("delete"))
      }

      const { data, error } = await authClient.organization.removeMember({
        organizationId: input.organizationId,
        memberIdOrEmail: input.memberIdOrEmail,
      })

      if (error) {
        throw new Error(error.message ?? m.members_remove_confirm_error())
      }

      return data
    },
    onSuccess: async (member) => {
      await revalidateSignedInAuthState(queryClient)

      await queryClient.invalidateQueries({
        queryKey: organizationMemberKeys.all,
      })

      options?.onSuccess?.(member)
    },
  })
}

function membersPermissionError(action: "update" | "delete") {
  return action === "update"
    ? m.members_edit_no_access_description()
    : m.members_remove_no_access_description()
}
