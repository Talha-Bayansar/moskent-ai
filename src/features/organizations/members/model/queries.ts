import { useInfiniteQuery } from "@tanstack/react-query"
import { useQuery } from "@tanstack/react-query"

import {
  type OrganizationMemberSummary,
  type OrganizationMembersPage,
} from "./types"
import { authClient } from "@/shared/auth/model/auth-client"
import { authKeys } from "@/shared/auth/model/query-keys"
import { m } from "@/shared/i18n"

export const organizationMemberKeys = {
  all: [...authKeys.all, "members"] as const,
  list: (organizationId: string | null, pageSize: number) =>
    authKeys.members(organizationId, pageSize),
  detail: (organizationId: string | null, memberId: string) =>
    authKeys.member(organizationId, memberId),
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

function findMemberInResponse(
  data: unknown,
  memberId: string
): OrganizationMemberSummary | null {
  const { members } = normalizeMembersResponse(data)

  return (
    members.find((member) => member.id === memberId) ?? null
  )
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

type UseOrganizationMemberQueryOptions = {
  organizationId: string | null
  memberId: string
  enabled?: boolean
  pageSize?: number
}

async function fetchOrganizationMemberById({
  organizationId,
  memberId,
  pageSize,
}: {
  organizationId: string | null
  memberId: string
  pageSize: number
}) {
  let offset = 0

  while (true) {
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

    const member = findMemberInResponse(data, memberId)

    if (member) {
      return member
    }

    const { members, total } = normalizeMembersResponse(data)
    const nextOffset = offset + members.length

    if (members.length < pageSize || nextOffset >= total) {
      return null
    }

    offset = nextOffset
  }
}

export function useOrganizationMemberQuery({
  organizationId,
  memberId,
  enabled = true,
  pageSize = 100,
}: UseOrganizationMemberQueryOptions) {
  return useQuery({
    queryKey: organizationMemberKeys.detail(organizationId, memberId),
    enabled: enabled && Boolean(organizationId) && Boolean(memberId),
    queryFn: async () => {
      const member = await fetchOrganizationMemberById({
        organizationId,
        memberId,
        pageSize,
      })

      return member
    },
  })
}
