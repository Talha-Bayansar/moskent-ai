import { useLocation, useNavigate } from "@tanstack/react-router"
import { useEffect, useState } from "react"

import {
  useOrganizationsQuery,
  useSetActiveOrganizationMutation,
} from "../organization-session"
import { useAuthSessionQuery } from "../session"
import type { ReactNode } from "react"

import { m } from "@/shared/i18n"
import { Spinner } from "@/shared/ui/spinner"

type AuthenticatedRouteProps = {
  children: ReactNode
  requireOrganization?: boolean
  redirectIfHasOrganizationsTo?: string
}

export function AuthenticatedRoute({
  children,
  requireOrganization = true,
  redirectIfHasOrganizationsTo,
}: AuthenticatedRouteProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const sessionState = useAuthSessionQuery()
  const session = sessionState.data
  const activeOrganizationId = session?.session.activeOrganizationId ?? null
  const shouldCheckOrganizations =
    requireOrganization || Boolean(redirectIfHasOrganizationsTo)
  const organizationsQuery = useOrganizationsQuery({
    enabled: shouldCheckOrganizations && Boolean(session),
  })
  const setActiveOrganizationMutation = useSetActiveOrganizationMutation()
  const [bootstrappedOrganizationId, setBootstrappedOrganizationId] = useState<
    string | null
  >(null)
  const organizations = shouldCheckOrganizations
    ? organizationsQuery.data ?? []
    : []
  const firstOrganizationId = organizations[0]?.id ?? null
  const effectiveActiveOrganizationId =
    activeOrganizationId ?? bootstrappedOrganizationId
  const isCreateOrganizationRoute =
    location.pathname === "/organizations/new" ||
    location.pathname === "/organizations/new/"
  const shouldRedirectToDashboardWithOrganizations =
    Boolean(redirectIfHasOrganizationsTo) &&
    Boolean(session) &&
    (Boolean(activeOrganizationId) ||
      (!organizationsQuery.isPending && organizations.length > 0))
  const redirectTo =
    typeof window === "undefined"
      ? `${location.pathname}${location.searchStr}${location.hash}`
      : `${window.location.pathname}${window.location.search}${window.location.hash}`
  const shouldRedirectToCreateOrganization =
    requireOrganization &&
    session &&
    organizations.length === 0 &&
    !isCreateOrganizationRoute &&
    !organizationsQuery.isPending
  const shouldRedirectToSignIn = !session && !sessionState.isPending

  useEffect(() => {
    if (!requireOrganization) {
      return
    }

    if (activeOrganizationId) {
      setBootstrappedOrganizationId(null)
    }
  }, [activeOrganizationId, requireOrganization])

  useEffect(() => {
    if (!shouldRedirectToCreateOrganization) {
      return
    }

    void navigate({
      to: "/organizations",
      replace: true,
    })
  }, [navigate, shouldRedirectToCreateOrganization])

  useEffect(() => {
    if (!shouldRedirectToDashboardWithOrganizations || !redirectIfHasOrganizationsTo) {
      return
    }

    void navigate({
      to: redirectIfHasOrganizationsTo,
      replace: true,
    })
  }, [navigate, redirectIfHasOrganizationsTo, shouldRedirectToDashboardWithOrganizations])

  useEffect(() => {
    if (!shouldRedirectToSignIn) {
      return
    }

    void navigate({
      to: "/sign-in",
      search: {
        redirectTo,
      },
      replace: true,
    })
  }, [navigate, redirectTo, shouldRedirectToSignIn])

  useEffect(() => {
    if (!requireOrganization) {
      return
    }

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
    requireOrganization,
    setActiveOrganizationMutation,
  ])

  const isPending =
    sessionState.isPending ||
    (requireOrganization && Boolean(session) && organizationsQuery.isPending) ||
    (Boolean(redirectIfHasOrganizationsTo) &&
      Boolean(session) &&
      (shouldRedirectToDashboardWithOrganizations ||
        organizationsQuery.isPending)) ||
    (requireOrganization &&
      organizations.length > 0 &&
      !effectiveActiveOrganizationId &&
      !setActiveOrganizationMutation.isError) ||
    (requireOrganization && setActiveOrganizationMutation.isPending)
  const bootstrapError = requireOrganization
    ? organizationsQuery.error ?? setActiveOrganizationMutation.error
    : null

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

  if (shouldRedirectToCreateOrganization || shouldRedirectToSignIn) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-muted/20 px-6 py-10">
        <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-3xl border border-border/70 bg-background p-8 text-center shadow-sm">
          <Spinner className="size-6" />
        </div>
      </main>
    )
  }

  if (!session) {
    return null
  }

  return children
}
