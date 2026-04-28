import { useMutation, useQueryClient } from "@tanstack/react-query"

import { revalidateSignedInAuthState } from "@/shared/auth/model/auth-cache"
import { authClient } from "@/shared/auth/model/auth-client"
import { m } from "@/shared/i18n"

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
      await revalidateSignedInAuthState(queryClient)

      options?.onSuccess?.(organization)
    },
  })
}
