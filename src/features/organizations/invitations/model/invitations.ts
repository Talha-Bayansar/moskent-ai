import { useMutation } from "@tanstack/react-query"
import { z } from "zod"

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
