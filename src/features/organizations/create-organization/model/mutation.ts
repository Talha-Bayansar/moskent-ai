import { useMutation, useQueryClient } from "@tanstack/react-query"

import {
  type CreateOrganizationInput,
  createOrganizationSchema,
  normalizeOrganizationName,
  normalizeOrganizationSlug,
} from "./schema"
import { revalidateSignedInAuthState } from "@/shared/auth/model/auth-cache"
import { authClient } from "@/shared/auth/model/auth-client"
import { m } from "@/shared/i18n"

type CreateOrganizationMutationOptions = {
  onSuccess?: (organization: unknown) => void
}

export function useCreateOrganizationMutation(
  options?: CreateOrganizationMutationOptions
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateOrganizationInput) => {
      const parsed = createOrganizationSchema.parse({
        name: normalizeOrganizationName(input.name),
        slug: normalizeOrganizationSlug(input.slug),
      })

      const { data, error } = await authClient.organization.create({
        name: parsed.name,
        slug: parsed.slug,
        keepCurrentActiveOrganization: false,
      })

      if (error) {
        throw new Error(error.message ?? m.organization_create_generic_error())
      }

      return data
    },
    onSuccess: async (organization) => {
      await revalidateSignedInAuthState(queryClient)

      options?.onSuccess?.(organization)
    },
  })
}
