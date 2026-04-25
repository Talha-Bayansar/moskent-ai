import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"

import { organizationKeys } from "@/shared/auth/organization-session"
import { authClient } from "@/shared/auth/auth-client"
import { m } from "@/shared/i18n"

export const inviteOrganizationMemberSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, m.validation_email_required())
    .email(m.validation_email_invalid()),
})

export type InviteOrganizationMemberInput = z.input<
  typeof inviteOrganizationMemberSchema
>

export function normalizeOrganizationInvitationEmail(email: string) {
  return email.trim().toLowerCase()
}

export type OrganizationInvitationOrganizationSummary = {
  id?: string
  name?: string | null
  slug?: string | null
  logo?: string | null
}

export type OrganizationInvitationUserSummary = {
  id?: string
  name?: string | null
  email?: string | null
  image?: string | null
}

export type OrganizationInvitationSummary = {
  id: string
  email?: string | null
  role?: string | Array<string> | null
  status?: string | null
  createdAt?: string | Date | null
  expiresAt?: string | Date | null
  organizationId?: string
  organizationName?: string | null
  organizationSlug?: string | null
  organizationLogo?: string | null
  organization?: OrganizationInvitationOrganizationSummary | null
  inviter?: {
    user?: OrganizationInvitationUserSummary | null
  } | null
}

export const organizationInvitationKeys = {
  all: ["organization-invitations"] as const,
  list: () => [...organizationInvitationKeys.all, "list"] as const,
}

type UseUserOrganizationInvitationsQueryOptions = {
  enabled?: boolean
}

function normalizeUserInvitationsResponse(
  data: unknown
): Array<OrganizationInvitationSummary> {
  if (Array.isArray(data)) {
    return data as Array<OrganizationInvitationSummary>
  }

  if (data && typeof data === "object") {
    const maybeData = (data as { data?: unknown }).data

    if (Array.isArray(maybeData)) {
      return maybeData as Array<OrganizationInvitationSummary>
    }
  }

  return []
}

export function useUserOrganizationInvitationsQuery(
  options?: UseUserOrganizationInvitationsQueryOptions
) {
  return useQuery({
    queryKey: organizationInvitationKeys.list(),
    queryFn: async () => {
      const { data, error } = await authClient.organization.listUserInvitations()

      if (error) {
        throw new Error(error.message ?? m.organization_invitations_generic_error())
      }

      return normalizeUserInvitationsResponse(data).filter((invitation) => {
        if (!invitation.status) {
          return true
        }

        return invitation.status === "pending"
      })
    },
    enabled: options?.enabled ?? true,
  })
}

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
      await queryClient.invalidateQueries({
        queryKey: organizationInvitationKeys.list(),
      })

      await queryClient.invalidateQueries({
        queryKey: organizationKeys.list(),
      })

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
  return useMutation({
    mutationFn: async (
      input: InviteOrganizationMemberInput & { organizationId?: string | null }
    ) => {
      const parsed = inviteOrganizationMemberSchema.parse({
        email: normalizeOrganizationInvitationEmail(input.email),
      })

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
