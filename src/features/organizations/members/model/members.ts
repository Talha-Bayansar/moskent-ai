import { useInfiniteQuery } from "@tanstack/react-query"

import { authClient } from "@/shared/auth/auth-client"
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
  nextCursor?: number
}

export const organizationMemberKeys = {
  all: ["organization-members"] as const,
  list: (organizationId: string | null, pageSize: number) =>
    [...organizationMemberKeys.all, organizationId ?? "active", pageSize] as const,
}

type UseOrganizationMembersInfiniteQueryOptions = {
  organizationId: string | null
  enabled?: boolean
  pageSize?: number
}

function normalizeMembersResponse(data: unknown): Array<OrganizationMemberSummary> {
  if (Array.isArray(data)) {
    return data as Array<OrganizationMemberSummary>
  }

  if (data && typeof data === "object") {
    const maybeData = (data as { data?: unknown }).data

    if (Array.isArray(maybeData)) {
      return maybeData as Array<OrganizationMemberSummary>
    }
  }

  return []
}

function getNextCursor(
  pageParam: number,
  members: Array<OrganizationMemberSummary>,
  pageSize: number
) {
  if (members.length < pageSize) {
    return undefined
  }

  return pageParam + members.length
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

      const members = normalizeMembersResponse(data)

      return {
        members,
        nextCursor: getNextCursor(offset, members, pageSize),
      } satisfies OrganizationMembersPage
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })
}
