import type { QueryClient } from "@tanstack/react-query"

export const authKeys = {
  all: ["auth"] as const,
  currentUser: () => [...authKeys.all, "current-user"] as const,
  session: () => authKeys.currentUser(),
  organizations: () => [...authKeys.all, "organizations"] as const,
  invitations: () => [...authKeys.all, "invitations"] as const,
  members: (organizationId: string | null, pageSize: number) =>
    [...authKeys.all, "members", organizationId ?? "active", pageSize] as const,
  member: (organizationId: string | null, memberId: string) =>
    [...authKeys.all, "members", organizationId ?? "active", memberId] as const,
  roles: (
    organizationId: string | null,
    pageSize: number,
    search: string
  ) =>
    [
      ...authKeys.all,
      "roles",
      organizationId ?? "active",
      pageSize,
      search.trim(),
    ] as const,
}

export async function clearAuthQueryCache(queryClient: QueryClient) {
  await queryClient.cancelQueries({
    queryKey: authKeys.all,
  })

  queryClient.removeQueries({
    queryKey: authKeys.all,
  })
}
