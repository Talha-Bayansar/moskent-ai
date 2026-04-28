import { useQuery } from "@tanstack/react-query"

import { getCurrentUser } from "../server/current-user.functions"
import { authKeys } from "./query-keys"

export type { CurrentUser } from "../server/current-user.server"

export function currentUserQueryOptions() {
  return {
    queryKey: authKeys.currentUser(),
    queryFn: async () => {
      return getCurrentUser()
    },
    staleTime: 0,
  }
}

type UseCurrentUserQueryOptions = {
  enabled?: boolean
}

export function useCurrentUserQuery(options?: UseCurrentUserQueryOptions) {
  return useQuery({
    ...currentUserQueryOptions(),
    enabled: options?.enabled ?? true,
  })
}
