import { z } from "zod"

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

export const createOrganizationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, m.validation_organization_name_min({ count: 2 }))
    .max(80, m.validation_organization_name_max({ count: 80 })),
  slug: z
    .string()
    .trim()
    .min(2, m.validation_organization_slug_min({ count: 2 }))
    .max(80, m.validation_organization_slug_max({ count: 80 }))
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      m.validation_organization_slug_pattern()
    ),
})

export type CreateOrganizationInput = z.input<typeof createOrganizationSchema>

export function normalizeOrganizationName(name: string) {
  return name.trim().replace(/\s+/g, " ")
}

export function normalizeOrganizationSlug(value: string) {
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

export function deriveOrganizationSlug(name: string) {
  return normalizeOrganizationSlug(name)
}
