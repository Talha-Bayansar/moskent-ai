import { z } from "zod"

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
