import { randomUUID } from "node:crypto"

import { eq } from "drizzle-orm"

import {
  baselineOrganizationRoleNames,
  baselineOrganizationRolePermissions,
} from "../permissions"
import { getDatabaseClient } from "../../database/client.server"

import { organizationRole } from "./schema"

export async function ensureBaselineOrganizationRoles(organizationId: string) {
  const db = getDatabaseClient()

  const existingRoles = await db
    .select({ role: organizationRole.role })
    .from(organizationRole)
    .where(eq(organizationRole.organizationId, organizationId))

  const existingRoleNames = new Set(existingRoles.map((row) => row.role))
  const missingRoleNames = baselineOrganizationRoleNames.filter(
    (roleName) => !existingRoleNames.has(roleName)
  )

  if (missingRoleNames.length === 0) {
    return
  }

  await db
    .insert(organizationRole)
    .values(
      missingRoleNames.map((roleName) => ({
        id: randomUUID(),
        organizationId,
        role: roleName,
        permission: JSON.stringify(baselineOrganizationRolePermissions[roleName]),
        createdAt: new Date(),
      }))
    )
    .onConflictDoNothing()
}
