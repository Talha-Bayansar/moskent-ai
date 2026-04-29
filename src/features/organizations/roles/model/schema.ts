import { z } from "zod"

import { organizationStatements } from "@/shared/auth/permissions"
import { m } from "@/shared/i18n"

const TURKISH_CHAR_MAP: Record<string, string> = {
  ç: "c",
  Ç: "c",
  ğ: "g",
  Ğ: "g",
  ı: "i",
  I: "i",
  İ: "i",
  ö: "o",
  Ö: "o",
  ş: "s",
  Ş: "s",
  ü: "u",
  Ü: "u",
}

export const createRoleSchema = z.object({
  role: z
    .string()
    .trim()
    .min(2, m.validation_role_name_min({ count: 2 }))
    .max(50, m.validation_role_name_max({ count: 50 }))
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      m.validation_role_name_pattern()
  ),
  permission: z.record(z.string(), z.array(z.string())),
})

export const updateRoleSchema = z.object({
  permission: z.record(z.string(), z.array(z.string())),
})

export const createRoleNameDraftSchema = z.object({
  role: z
    .string()
    .trim()
    .min(2, m.validation_role_name_min({ count: 2 }))
    .max(50, m.validation_role_name_max({ count: 50 })),
})

export type CreateRoleInput = z.input<typeof createRoleSchema>

export function normalizeRoleName(value: string) {
  return value
    .trim()
    .replace(/[çÇğĞıİöÖşŞüÜ]/g, (character) => TURKISH_CHAR_MAP[character] ?? character)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
}

export function createEmptyRolePermissionMap(): Record<string, Array<string>> {
  return Object.fromEntries(
    Object.keys(organizationStatements).map((resource) => [resource, [] as Array<string>])
  )
}

export function normalizeRolePermissionMap(
  permission: Record<string, Array<string>>
): Record<string, Array<string>> {
  return Object.fromEntries(
    Object.entries(organizationStatements).map(([resource, allowedActions]) => {
      const allowedActionList = allowedActions as ReadonlyArray<string>
      const selectedActions = permission[resource] ?? []

      return [
        resource,
        Array.from(
          new Set(
            selectedActions.filter((action) =>
              allowedActionList.includes(action)
            )
          )
        ),
      ]
    })
  )
}

export const rolePermissionEntries = Object.entries(
  organizationStatements
) as Array<[string, ReadonlyArray<string>]>
