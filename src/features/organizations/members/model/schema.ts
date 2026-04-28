import { z } from "zod"

import { m } from "@/shared/i18n"

export const updateMemberRoleSchema = z.object({
  role: z.string().trim().min(1, m.validation_member_role_required()),
})

export type UpdateMemberRoleInput = z.input<typeof updateMemberRoleSchema>
