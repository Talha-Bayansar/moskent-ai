import { Navigate, useLocation } from "@tanstack/react-router"
import { useEffect, useState } from "react"

import {
  useOrganizationsQuery,
  useSetActiveOrganizationMutation,
} from "../organization-session"
import type { ReactNode } from "react"

import { authClient } from "@/shared/auth/auth-client"
import { m } from "@/shared/i18n"
import { Spinner } from "@/shared/ui/spinner"

type AuthenticatedRouteProps = {
  children: ReactNode
}

export function AuthenticatedRoute({ children }: AuthenticatedRouteProps) {
  const location = useLocation()
  const sessionState = authClient.useSession()
  const session = sessionState.data
  const activeOrganizationId = session?.session.activeOrganizationId ?? null
  const organizationsQuery = useOrganizationsQuery({
    enabled: Boolean(session),
  })
  const setActiveOrganizationMutation = useSetActiveOrganizationMutation()
  const [bootstrappedOrganizationId, setBootstrappedOrganizationId] = useState<
    string | null
  >(null)
  const organizations = organizationsQuery.data ?? []
  const firstOrganizationId = organizations[0]?.id ?? null
  const effectiveActiveOrganizationId =
    activeOrganizationId ?? bootstrappedOrganizationId
  const isCreateOrganizationRoute =
    location.pathname === "/organizations/new" ||
    location.pathname === "/organizations/new/"
  const redirectTo =
    typeof window === "undefined"
      ? `${location.pathname}${location.searchStr}${location.hash}`
      : `${window.location.pathname}${window.location.search}${window.location.hash}`

  useEffect(() => {
    if (activeOrganizationId) {
      setBootstrappedOrganizationId(null)
    }
  }, [activeOrganizationId])

  useEffect(() => {
    if (
      !session ||
      !firstOrganizationId ||
      activeOrganizationId ||
      bootstrappedOrganizationId === firstOrganizationId ||
      setActiveOrganizationMutation.isPending
    ) {
      return
    }

    void setActiveOrganizationMutation
      .mutateAsync(firstOrganizationId)
      .then(() => {
        setBootstrappedOrganizationId(firstOrganizationId)
      })
      .catch(() => {
        // Mutation state owns the user-facing error branch below.
      })
  }, [
    activeOrganizationId,
    bootstrappedOrganizationId,
    firstOrganizationId,
    session,
    setActiveOrganizationMutation,
  ])

  const isPending =
    sessionState.isPending ||
    (Boolean(session) && organizationsQuery.isPending) ||
    (organizations.length > 0 &&
      !effectiveActiveOrganizationId &&
      !setActiveOrganizationMutation.isError) ||
    setActiveOrganizationMutation.isPending
  const bootstrapError =
    organizationsQuery.error ?? setActiveOrganizationMutation.error

  if (isPending) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-muted/20 px-6 py-10">
        <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-3xl border border-border/70 bg-background p-8 text-center shadow-sm">
          <Spinner className="size-6" />
          <div className="space-y-2">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              {m.auth_checking_title()}
            </h1>
            <p className="text-sm leading-6 text-muted-foreground">
              {m.auth_checking_description()}
            </p>
          </div>
        </div>
      </main>
    )
  }

  if (bootstrapError) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-muted/20 px-6 py-10">
        <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-3xl border border-border/70 bg-background p-8 text-center shadow-sm">
          <div className="space-y-2">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              {m.organization_bootstrap_error_title()}
            </h1>
            <p className="text-sm leading-6 text-muted-foreground">
              {bootstrapError.message}
            </p>
          </div>
        </div>
      </main>
    )
  }

  if (
    session &&
    organizations.length === 0 &&
    !isCreateOrganizationRoute &&
    !organizationsQuery.isPending
  ) {
    return <Navigate to="/organizations/new" replace />
  }

  if (!session) {
    return (
      <Navigate
        to="/sign-in"
        search={{
          redirectTo,
        }}
        replace
      />
    )
  }

  return children
}
