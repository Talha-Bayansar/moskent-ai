import { eq } from "drizzle-orm"

import { auth } from "./auth.server"
import { ensureBaselineOrganizationRoles } from "./organization-roles.server"
import { organization } from "./schema"
import { getDatabaseClient } from "../../database/client.server"

type AuthInstance = typeof auth
type SessionResponse = Awaited<ReturnType<AuthInstance["api"]["getSession"]>>
type SessionData = NonNullable<SessionResponse>

type JsonPrimitive = string | number | boolean | null
type JsonValue = JsonPrimitive | { [key: string]: JsonValue } | Array<JsonValue>

export type CurrentUserRolePermissionMap = {
  [resource: string]: Array<string>
}

export type CurrentUserActiveOrganizationRole = {
  role: string
  permission: CurrentUserRolePermissionMap | null
}

export type CurrentUserActiveOrganization = {
  id: string
  name: string
  slug: string
  logo: string | null
  metadata: JsonValue | null
  createdAt: Date
}

export type CurrentUser = {
  user: SessionData["user"]
  session: SessionData["session"] & {
    activeOrganizationId: string | null
  }
  activeOrganization: CurrentUserActiveOrganization | null
  activeOrganizationRole: CurrentUserActiveOrganizationRole | null
}

function parsePossiblyJson(value: string | null | undefined): JsonValue | null {
  if (value == null) {
    return null
  }

  try {
    return JSON.parse(value) as JsonValue
  } catch {
    return value
  }
}

export async function findCurrentUser(headers: Headers) {
  const db = getDatabaseClient()

  const sessionData = await auth.api.getSession({
    headers,
  })

  if (!sessionData) {
    return null
  }

  const activeOrganizationId = sessionData.session.activeOrganizationId ?? null

  if (!activeOrganizationId) {
    return {
      user: sessionData.user,
      session: {
        ...sessionData.session,
        activeOrganizationId: null,
      },
      activeOrganization: null,
      activeOrganizationRole: null,
    } satisfies CurrentUser
  }

  const [activeOrganization, activeMember] = await Promise.all([
    db.query.organization.findFirst({
      where: eq(organization.id, activeOrganizationId),
    }),
    auth.api.getActiveMember({
      headers,
    }),
  ])

  if (!activeOrganization || !activeMember) {
    return {
      user: sessionData.user,
      session: {
        ...sessionData.session,
        activeOrganizationId: null,
      },
      activeOrganization: null,
      activeOrganizationRole: null,
    } satisfies CurrentUser
  }

  const roleName = activeMember.role

  if (!roleName) {
    return {
      user: sessionData.user,
      session: {
        ...sessionData.session,
        activeOrganizationId: null,
      },
      activeOrganization: null,
      activeOrganizationRole: null,
    } satisfies CurrentUser
  }

  await ensureBaselineOrganizationRoles(activeOrganizationId)

  const activeOrganizationRole = await auth.api.getOrgRole({
    headers,
    query: {
      organizationId: activeOrganizationId,
      roleName,
    },
  })

  return {
    user: sessionData.user,
    session: {
      ...sessionData.session,
      activeOrganizationId: activeOrganization.id,
    },
    activeOrganization: {
      id: activeOrganization.id,
      name: activeOrganization.name,
      slug: activeOrganization.slug,
      logo: activeOrganization.logo ?? null,
      metadata: parsePossiblyJson(activeOrganization.metadata),
      createdAt: activeOrganization.createdAt,
    },
    activeOrganizationRole: {
      role: roleName,
      permission: activeOrganizationRole?.permission ?? null,
    },
  } satisfies CurrentUser
}
