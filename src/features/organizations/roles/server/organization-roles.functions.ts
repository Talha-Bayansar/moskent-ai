import { createServerFn } from "@tanstack/react-start"
import { getRequestHeaders } from "@tanstack/react-start/server"
import { count, desc, eq } from "drizzle-orm"
import { z } from "zod"

import { findCurrentUser } from "@/shared/auth/server/current-user.server"
import { organizationRole } from "@/shared/auth/server/schema"
import { getDatabaseClient } from "@/shared/database/client.server"

const organizationRolesPageInputSchema = z.object({
  organizationId: z.string().optional().nullable(),
  limit: z.number().int().positive().optional(),
  offset: z.number().int().nonnegative().optional(),
})

export const getOrganizationRolesPage = createServerFn({ method: "GET" })
  .inputValidator(organizationRolesPageInputSchema)
  .handler(async ({ data }) => {
    const headers = getRequestHeaders()
    const currentUser = await findCurrentUser(headers)
    const activeOrganizationId = currentUser?.session.activeOrganizationId ?? null
    const organizationId = data.organizationId ?? activeOrganizationId
    const pageSize = Math.min(Math.max(data.limit ?? 20, 1), 50)
    const offset = Math.max(data.offset ?? 0, 0)

    if (!organizationId) {
      return {
        roles: [],
        total: 0,
        nextCursor: undefined,
      }
    }

    const rolePermissions = currentUser?.activeOrganizationRole?.permission ?? null
    const canReadRoles = rolePermissions ? rolePermissions.ac.includes("read") : false

    if (!canReadRoles) {
      throw new Error(
        "You do not have permission to read organization roles."
      )
    }

    const db = getDatabaseClient()
    const whereClause = eq(organizationRole.organizationId, organizationId)

    const [{ total }] = await db
      .select({ total: count() })
      .from(organizationRole)
      .where(whereClause)

    const rows = await db
      .select()
      .from(organizationRole)
      .where(whereClause)
      .orderBy(desc(organizationRole.createdAt), desc(organizationRole.id))
      .limit(pageSize)
      .offset(offset)

    const roles = rows.map((row) => ({
      id: row.id,
      organizationId: row.organizationId,
      role: row.role,
      permission: parsePermission(row.permission),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt ?? null,
    }))

    const nextCursor = offset + roles.length

    const totalCount = Number(total)

    return {
      roles,
      total: totalCount,
      nextCursor: nextCursor < totalCount ? nextCursor : undefined,
    }
  })

function parsePermission(value: string) {
  try {
    const parsed = JSON.parse(value) as unknown

    if (!parsed || typeof parsed !== "object") {
      return {}
    }

    return Object.entries(parsed as Record<string, unknown>).reduce<
      Record<string, Array<string>>
    >((acc, [resource, actions]) => {
      if (!Array.isArray(actions)) {
        return acc
      }

      acc[resource] = actions.filter((action): action is string => {
        return typeof action === "string"
      })

      return acc
    }, {})
  } catch {
    return {}
  }
}
