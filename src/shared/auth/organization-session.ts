import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { authClient } from "./auth-client"

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
  all: ["organizations"] as const,
  list: () => [...organizationKeys.all, "list"] as const,
}

type OrganizationsQueryOptions = {
  enabled?: boolean
}

export function useOrganizationsQuery(options?: OrganizationsQueryOptions) {
  return useQuery({
    queryKey: organizationKeys.list(),
    queryFn: async () => {
      const { data, error } = await authClient.organization.list()

      if (error) {
        throw new Error(error.message ?? m.organization_list_generic_error())
      }

      return data as Array<OrganizationSummary>
    },
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
      await queryClient.invalidateQueries({
        queryKey: organizationKeys.list(),
      })

      options?.onSuccess?.(organization)
    },
  })
}
