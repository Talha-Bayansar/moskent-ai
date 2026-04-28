import { useMutation, useQueryClient } from "@tanstack/react-query"

import {
  type InviteOrganizationMemberInput,
  inviteOrganizationMemberSchema,
  normalizeOrganizationInvitationEmail,
} from "./schema"
import { useCurrentUserQuery } from "@/shared/auth/model/current-user"
import { revalidateSignedInAuthState } from "@/shared/auth/model/auth-cache"
import { authClient } from "@/shared/auth/model/auth-client"
import { hasPermission } from "@/shared/auth/model/permission-checks"
import { m } from "@/shared/i18n"

type InvitationMutationOptions = {
  onSuccess?: (invitation: unknown) => void
}

function useInvitationMutation(
  mutationFn: (invitationId: string) => Promise<unknown>,
  options?: InvitationMutationOptions
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: async (invitation) => {
      await revalidateSignedInAuthState(queryClient)

      options?.onSuccess?.(invitation)
    },
  })
}

export function useAcceptOrganizationInvitationMutation(
  options?: InvitationMutationOptions
) {
  return useInvitationMutation(
    async (invitationId: string) => {
      const { data, error } = await authClient.organization.acceptInvitation({
        invitationId,
      })

      if (error) {
        throw new Error(error.message ?? m.organization_invitations_generic_error())
      }

      return data
    },
    options
  )
}

export function useRejectOrganizationInvitationMutation(
  options?: InvitationMutationOptions
) {
  return useInvitationMutation(
    async (invitationId: string) => {
      const { data, error } = await authClient.organization.rejectInvitation({
        invitationId,
      })

      if (error) {
        throw new Error(error.message ?? m.organization_invitations_generic_error())
      }

      return data
    },
    options
  )
}

type InviteOrganizationMemberMutationOptions = {
  onSuccess?: (invitation: unknown) => void
}

export function useInviteOrganizationMemberMutation(
  options?: InviteOrganizationMemberMutationOptions
) {
  const currentUserState = useCurrentUserQuery()

  return useMutation({
    mutationFn: async (
      input: InviteOrganizationMemberInput & { organizationId?: string | null }
    ) => {
      const parsed = inviteOrganizationMemberSchema.parse({
        email: normalizeOrganizationInvitationEmail(input.email),
      })

      const rolePermissions =
        currentUserState.data?.activeOrganizationRole?.permission ?? null

      if (!hasPermission(rolePermissions, "invitation", "create")) {
        throw new Error(m.organization_invite_generic_error())
      }

      const { data, error } = await authClient.organization.inviteMember({
        email: parsed.email,
        role: "member",
        ...(input.organizationId ? { organizationId: input.organizationId } : {}),
      })

      if (error) {
        throw new Error(error.message ?? m.organization_invite_generic_error())
      }

      return data
    },
    onSuccess: (invitation) => {
      options?.onSuccess?.(invitation)
    },
  })
}
