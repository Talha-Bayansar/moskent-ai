import type { QueryClient } from "@tanstack/react-query"

export const authKeys = {
  all: ["auth"] as const,
  session: () => [...authKeys.all, "session"] as const,
  organizations: () => [...authKeys.all, "organizations"] as const,
  invitations: () => [...authKeys.all, "invitations"] as const,
  members: (organizationId: string | null, pageSize: number) =>
    [...authKeys.all, "members", organizationId ?? "active", pageSize] as const,
}

export async function clearAuthQueryCache(queryClient: QueryClient) {
  await queryClient.cancelQueries({
    queryKey: authKeys.all,
  })

  queryClient.removeQueries({
    queryKey: authKeys.all,
  })
}
