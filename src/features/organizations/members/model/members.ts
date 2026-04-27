import { useInfiniteQuery } from "@tanstack/react-query"

import { authClient } from "@/shared/auth/auth-client"
import { authKeys } from "@/shared/auth/query-keys"
import { m } from "@/shared/i18n"

export type OrganizationMemberUserSummary = {
  id?: string
  name?: string | null
  email?: string | null
  image?: string | null
}

export type OrganizationMemberSummary = {
  id: string
  organizationId?: string
  userId?: string
  role?: string | Array<string> | null
  createdAt?: string | Date | null
  user?: OrganizationMemberUserSummary | null
  name?: string | null
  email?: string | null
  image?: string | null
}

export type OrganizationMembersPage = {
  members: Array<OrganizationMemberSummary>
  total: number
  nextCursor?: number
}

export const organizationMemberKeys = {
  all: [...authKeys.all, "members"] as const,
  list: (organizationId: string | null, pageSize: number) =>
    authKeys.members(organizationId, pageSize),
}

type UseOrganizationMembersInfiniteQueryOptions = {
  organizationId: string | null
  enabled?: boolean
  pageSize?: number
}

function normalizeMembersResponse(data: unknown): {
  members: Array<OrganizationMemberSummary>
  total: number
} {
  if (data && typeof data === "object") {
    const maybeMembers = (data as { members?: unknown }).members
    const maybeTotal = (data as { total?: unknown }).total

    if (Array.isArray(maybeMembers)) {
      return {
        members: maybeMembers as Array<OrganizationMemberSummary>,
        total: typeof maybeTotal === "number" ? maybeTotal : maybeMembers.length,
      }
    }

    const maybeData = (data as { data?: unknown }).data

    if (maybeData && typeof maybeData === "object") {
      const nestedMembers = (maybeData as { members?: unknown }).members
      const nestedTotal = (maybeData as { total?: unknown }).total

      if (Array.isArray(nestedMembers)) {
        return {
          members: nestedMembers as Array<OrganizationMemberSummary>,
          total:
            typeof nestedTotal === "number"
              ? nestedTotal
              : nestedMembers.length,
        }
      }
    }
  }

  return {
    members: [],
    total: 0,
  }
}

function getNextCursor(
  pageParam: number,
  members: Array<OrganizationMemberSummary>,
  total: number,
  pageSize: number
) {
  const nextCursor = pageParam + members.length

  if (members.length < pageSize || nextCursor >= total) {
    return undefined
  }

  return nextCursor
}

export function useOrganizationMembersInfiniteQuery({
  organizationId,
  enabled = true,
  pageSize = 20,
}: UseOrganizationMembersInfiniteQueryOptions) {
  return useInfiniteQuery({
    queryKey: organizationMemberKeys.list(organizationId, pageSize),
    initialPageParam: 0,
    enabled: enabled && Boolean(organizationId),
    queryFn: async ({ pageParam }) => {
      const offset = typeof pageParam === "number" ? pageParam : 0

      const { data, error } = await authClient.organization.listMembers({
        query: {
          organizationId: organizationId ?? undefined,
          limit: pageSize,
          offset,
          sortBy: "createdAt",
          sortDirection: "desc",
        },
      })

      if (error) {
        throw new Error(error.message ?? m.organization_members_generic_error())
      }

      const { members, total } = normalizeMembersResponse(data)

      return {
        members,
        total,
        nextCursor: getNextCursor(offset, members, total, pageSize),
      } satisfies OrganizationMembersPage
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })
}
