import { useInfiniteQuery } from "@tanstack/react-query"

import { getOrganizationRolesPage } from "../server/organization-roles.functions"
import type {
  OrganizationRoleSummary,
  OrganizationRolesPage,
} from "./types"
import { authKeys } from "@/shared/auth/model/query-keys"
import { m } from "@/shared/i18n"

export const organizationRoleKeys = {
  all: [...authKeys.all, "roles"] as const,
  list: (organizationId: string | null, pageSize: number) =>
    authKeys.roles(organizationId, pageSize),
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
