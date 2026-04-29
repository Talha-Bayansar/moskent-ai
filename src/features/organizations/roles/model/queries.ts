import { useInfiniteQuery, useQuery } from "@tanstack/react-query"

import { getOrganizationRolesPage } from "../server/organization-roles.functions"
import type {
  OrganizationRoleSummary,
  OrganizationRolesPage,
} from "./types"
import { authClient } from "@/shared/auth/model/auth-client"
import { authKeys } from "@/shared/auth/model/query-keys"
import { m } from "@/shared/i18n"

export const organizationRoleKeys = {
  all: [...authKeys.all, "roles"] as const,
  list: (organizationId: string | null, pageSize: number) =>
    authKeys.roles(organizationId, pageSize),
  detail: (organizationId: string | null, roleId: string) =>
    [...organizationRoleKeys.all, organizationId ?? "active", roleId] as const,
}

type UseOrganizationRolesInfiniteQueryOptions = {
  organizationId: string | null
  enabled?: boolean
  pageSize?: number
}

function normalizeRolesResponse(data: unknown): {
  roles: Array<OrganizationRoleSummary>
  total: number
} {
  if (data && typeof data === "object") {
    const maybeRoles = (data as { roles?: unknown }).roles
    const maybeTotal = (data as { total?: unknown }).total

    if (Array.isArray(maybeRoles)) {
      return {
        roles: maybeRoles as Array<OrganizationRoleSummary>,
        total: typeof maybeTotal === "number" ? maybeTotal : maybeRoles.length,
      }
    }

    const maybeData = (data as { data?: unknown }).data

    if (maybeData && typeof maybeData === "object") {
      const nestedRoles = (maybeData as { roles?: unknown }).roles
      const nestedTotal = (maybeData as { total?: unknown }).total

      if (Array.isArray(nestedRoles)) {
        return {
          roles: nestedRoles as Array<OrganizationRoleSummary>,
          total:
            typeof nestedTotal === "number"
              ? nestedTotal
              : nestedRoles.length,
        }
      }
    }
  }

  return {
    roles: [],
    total: 0,
  }
}

function getNextCursor(
  pageParam: number,
  roles: Array<OrganizationRoleSummary>,
  total: number,
  pageSize: number
) {
  const nextCursor = pageParam + roles.length

  if (roles.length < pageSize || nextCursor >= total) {
    return undefined
  }

  return nextCursor
}

function normalizeRoleResponse(data: unknown): OrganizationRoleSummary | null {
  if (!data || typeof data !== "object") {
    return null
  }

  const candidate = (data as { data?: unknown }).data ?? data

  const roleId =
    (candidate as { id?: unknown }).id ??
    (candidate as { roleId?: unknown }).roleId
  const organizationId =
    (candidate as { organizationId?: unknown }).organizationId ??
    (candidate as { organization_id?: unknown }).organization_id
  const roleName =
    (candidate as { role?: unknown }).role ??
    (candidate as { roleName?: unknown }).roleName
  const permission = (candidate as { permission?: unknown }).permission

  if (
    typeof roleId !== "string" ||
    typeof organizationId !== "string" ||
    typeof roleName !== "string"
  ) {
    return null
  }

  let normalizedPermission: unknown = permission

  if (typeof normalizedPermission === "string") {
    try {
      normalizedPermission = JSON.parse(normalizedPermission) as unknown
    } catch {
      return null
    }
  }

  if (normalizedPermission === null || typeof normalizedPermission !== "object") {
    return null
  }

  return {
    id: roleId,
    organizationId,
    role: roleName,
    permission: normalizedPermission as OrganizationRoleSummary["permission"],
    createdAt: (candidate as { createdAt?: unknown }).createdAt as
      | Date
      | string
      | null
      | undefined,
    updatedAt: (candidate as { updatedAt?: unknown }).updatedAt as
      | Date
      | string
      | null
      | undefined,
  }
}

export function useOrganizationRolesInfiniteQuery({
  organizationId,
  enabled = true,
  pageSize = 20,
}: UseOrganizationRolesInfiniteQueryOptions) {
  return useInfiniteQuery({
    queryKey: organizationRoleKeys.list(organizationId, pageSize),
    initialPageParam: 0,
    enabled: enabled && Boolean(organizationId),
    queryFn: async ({ pageParam }) => {
      const offset = typeof pageParam === "number" ? pageParam : 0

      try {
        const data = await getOrganizationRolesPage({
          data: {
            organizationId: organizationId ?? undefined,
            limit: pageSize,
            offset,
          },
        })

        const { roles, total } = normalizeRolesResponse(data)

        return {
          roles,
          total,
          nextCursor: getNextCursor(offset, roles, total, pageSize),
        } satisfies OrganizationRolesPage
      } catch (error) {
        throw new Error(
          error instanceof Error
            ? error.message
            : m.organization_roles_generic_error()
        )
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })
}

type UseOrganizationRoleQueryOptions = {
  organizationId: string | null
  roleId: string
  enabled?: boolean
}

export function useOrganizationRoleQuery({
  organizationId,
  roleId,
  enabled = true,
}: UseOrganizationRoleQueryOptions) {
  return useQuery<OrganizationRoleSummary | null, Error>({
    queryKey: organizationRoleKeys.detail(organizationId, roleId),
    enabled: enabled && Boolean(organizationId) && Boolean(roleId),
    queryFn: async () => {
      const { data, error } = await authClient.organization.getRole({
        query: {
          organizationId: organizationId ?? undefined,
          roleId,
        },
      })

      if (error) {
        const message = error.message ?? ""

        if (/not found/i.test(message)) {
          return null
        }

        throw new Error(message || m.organization_roles_generic_error())
      }

      return normalizeRoleResponse(data)
    },
  })
}
