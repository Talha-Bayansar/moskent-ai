import { useQuery } from "@tanstack/react-query"

import { type OrganizationInvitationSummary } from "./types"
import { authClient } from "@/shared/auth/auth-client"
import { authKeys } from "@/shared/auth/query-keys"
import { m } from "@/shared/i18n"

export const organizationInvitationKeys = {
  all: authKeys.invitations(),
  list: () => [...organizationInvitationKeys.all, "list"] as const,
}

type UseUserOrganizationInvitationsQueryOptions = {
  enabled?: boolean
}

function normalizeUserInvitationsResponse(
  data: unknown
): Array<OrganizationInvitationSummary> {
  if (Array.isArray(data)) {
    return data as Array<OrganizationInvitationSummary>
  }

  if (data && typeof data === "object") {
    const maybeData = (data as { data?: unknown }).data

    if (Array.isArray(maybeData)) {
      return maybeData as Array<OrganizationInvitationSummary>
    }
  }

  return []
}

export function useUserOrganizationInvitationsQuery(
  options?: UseUserOrganizationInvitationsQueryOptions
) {
  return useQuery({
    queryKey: organizationInvitationKeys.list(),
    queryFn: async () => {
      const { data, error } = await authClient.organization.listUserInvitations()

      if (error) {
        throw new Error(error.message ?? m.organization_invitations_generic_error())
      }

      return normalizeUserInvitationsResponse(data).filter((invitation) => {
        if (!invitation.status) {
          return true
        }

        return invitation.status === "pending"
      })
    },
    enabled: options?.enabled ?? true,
  })
}
