import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { authClient } from "./auth-client"
import { authKeys } from "./query-keys"
import { refreshSignedInAuthState } from "./auth-cache"

import { m } from "@/shared/i18n"

export type OrganizationSummary = {
  id: string
  name: string
  slug: string
  logo?: string | null
  metadata?: unknown
  createdAt?: Date | string
}

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

type SetActiveOrganizationMutationOptions = {
  onSuccess?: (organization: unknown) => void
}

export function useSetActiveOrganizationMutation(
  options?: SetActiveOrganizationMutationOptions
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (organizationId: string) => {
      const { data, error } = await authClient.organization.setActive({
        organizationId,
      })

      if (error) {
        throw new Error(error.message ?? m.organization_set_active_generic_error())
      }

      return data
    },
    onSuccess: async (organization) => {
      await refreshSignedInAuthState(queryClient)

      options?.onSuccess?.(organization)
    },
  })
}
