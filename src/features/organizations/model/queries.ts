import { useQuery } from "@tanstack/react-query"

import { type OrganizationSummary } from "./types"
import { authClient } from "@/shared/auth/auth-client"
import { authKeys } from "@/shared/auth/query-keys"
import { m } from "@/shared/i18n"

export const organizationKeys = {
  all: authKeys.organizations(),
  list: () => organizationKeys.all,
}

type OrganizationsQueryOptions = {
  enabled?: boolean
}

export function organizationListQueryOptions() {
  return {
    queryKey: organizationKeys.list(),
    queryFn: async () => {
      const { data, error } = await authClient.organization.list()

      if (error) {
        throw new Error(error.message ?? m.organization_list_generic_error())
      }

      return data as Array<OrganizationSummary>
    },
  }
}

export function useOrganizationsQuery(options?: OrganizationsQueryOptions) {
  return useQuery({
    ...organizationListQueryOptions(),
    enabled: options?.enabled ?? true,
  })
}
