import type { QueryClient } from "@tanstack/react-query"

import { authClient } from "./auth-client"
import { authKeys, clearAuthQueryCache } from "./query-keys"
import { authSessionQueryOptions } from "./session"
import type { OrganizationSummary } from "./organization-session"
import { m } from "@/shared/i18n"

export async function refreshSignedInAuthState(queryClient: QueryClient) {
  await clearAuthQueryCache(queryClient)

  const session = await queryClient.fetchQuery(authSessionQueryOptions())

  if (!session) {
    return {
      organizations: [],
      session: null,
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
    session,
  }
}

export async function revalidateSignedInAuthState(queryClient: QueryClient) {
  await queryClient.invalidateQueries({
    queryKey: authKeys.all,
  })

  const session = await queryClient.fetchQuery(authSessionQueryOptions())

  if (!session) {
    return {
      organizations: [],
      session: null,
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
    session,
  }
}
