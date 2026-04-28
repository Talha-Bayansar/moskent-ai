import type { QueryClient } from "@tanstack/react-query"

import { authClient } from "./auth-client"
import { authKeys, clearAuthQueryCache } from "./query-keys"
import { currentUserQueryOptions } from "./current-user"
import type { OrganizationSummary } from "./organization-session"
import { m } from "@/shared/i18n"

export async function refreshSignedInAuthState(queryClient: QueryClient) {
  await clearAuthQueryCache(queryClient)

  const currentUser = await queryClient.fetchQuery(currentUserQueryOptions())

  if (!currentUser) {
    return {
      organizations: [],
      currentUser: null,
    }
  }

  const organizations = await queryClient.fetchQuery<Array<OrganizationSummary>>({
    queryKey: authKeys.organizations(),
    queryFn: async () => {
      const { data, error } = await authClient.organization.list()

      if (error) {
        throw new Error(error.message ?? m.organization_list_generic_error())
      }

      return data as Array<OrganizationSummary>
    },
  })

  return {
    organizations,
    currentUser,
  }
}

export async function revalidateSignedInAuthState(queryClient: QueryClient) {
  await queryClient.invalidateQueries({
    queryKey: authKeys.all,
  })

  const currentUser = await queryClient.fetchQuery(currentUserQueryOptions())

  if (!currentUser) {
    return {
      organizations: [],
      currentUser: null,
    }
  }

  const organizations = await queryClient.fetchQuery<Array<OrganizationSummary>>({
    queryKey: authKeys.organizations(),
    queryFn: async () => {
      const { data, error } = await authClient.organization.list()

      if (error) {
        throw new Error(error.message ?? m.organization_list_generic_error())
      }

      return data as Array<OrganizationSummary>
    },
  })

  return {
    organizations,
    currentUser,
  }
}
