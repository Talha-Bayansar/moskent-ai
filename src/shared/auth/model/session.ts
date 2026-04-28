import { useQuery } from "@tanstack/react-query"

import { authClient } from "./auth-client"
import { authKeys } from "./query-keys"

import { m } from "@/shared/i18n"

export type AuthSession = Awaited<ReturnType<typeof authClient.getSession>>["data"]

async function fetchAuthSession() {
  const { data, error } = await authClient.getSession()

  if (error) {
    throw new Error(error.message ?? m.auth_generic_error())
  }

  return (data ?? null) as AuthSession
}

export function authSessionQueryOptions() {
  return {
    queryKey: authKeys.session(),
    queryFn: fetchAuthSession,
    staleTime: 0,
  }
}

export function useAuthSessionQuery() {
  return useQuery(authSessionQueryOptions())
}
