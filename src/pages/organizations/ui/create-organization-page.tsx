"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "@tanstack/react-router"

import { useOrganizationsQuery, useSetActiveOrganizationMutation } from "@/shared/auth/organization-session"
import { useAuthSessionQuery } from "@/shared/auth/session"
import { DashboardShell } from "@/pages/dashboard/ui/dashboard-shell"
import { OrganizationAccessShell } from "@/shared/auth/ui/organization-access-shell"
import { m } from "@/shared/i18n"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card"
import { Spinner } from "@/shared/ui/spinner"
import { CreateOrganizationForm } from "@/features/organizations/create-organization/ui/create-organization-form"

function OrganizationAccessLoadingState() {
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

function OrganizationAccessErrorState({ error }: { error: Error }) {
  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/20 px-6 py-10">
      <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-3xl border border-border/70 bg-background p-8 text-center shadow-sm">
        <div className="space-y-2">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            {m.organization_bootstrap_error_title()}
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            {error.message}
          </p>
        </div>
      </div>
    </main>
  )
}

function CreateOrganizationPageContent() {
  const navigate = useNavigate()
  const sessionState = useAuthSessionQuery()
  const organizationsQuery = useOrganizationsQuery({
    enabled: Boolean(sessionState.data),
  })
  const setActiveOrganizationMutation = useSetActiveOrganizationMutation()
  const [bootstrappedOrganizationId, setBootstrappedOrganizationId] = useState<
    string | null
  >(null)

  const session = sessionState.data
  const activeOrganizationId = session?.session.activeOrganizationId ?? null
  const organizations = organizationsQuery.data ?? []
  const hasOrganizations = organizations.length > 0
  const firstOrganizationId = organizations[0]?.id ?? null
  const effectiveActiveOrganizationId =
    activeOrganizationId ?? bootstrappedOrganizationId

  useEffect(() => {
    if (!hasOrganizations) {
      return
    }

    if (activeOrganizationId) {
      setBootstrappedOrganizationId(null)
      return
    }

    if (
      !session ||
      !firstOrganizationId ||
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
        // The error branch below owns user-facing feedback.
      })
  }, [
    activeOrganizationId,
    bootstrappedOrganizationId,
    firstOrganizationId,
    hasOrganizations,
    session,
    setActiveOrganizationMutation,
  ])

  const isPending =
    sessionState.isPending ||
    (Boolean(session) && organizationsQuery.isPending) ||
    (hasOrganizations &&
      !effectiveActiveOrganizationId &&
      !setActiveOrganizationMutation.isError) ||
    (hasOrganizations && setActiveOrganizationMutation.isPending)
  const bootstrapError = hasOrganizations
    ? organizationsQuery.error ?? setActiveOrganizationMutation.error
    : null
  const Shell = hasOrganizations ? DashboardShell : OrganizationAccessShell

  if (isPending) {
    return <OrganizationAccessLoadingState />
  }

  if (bootstrapError) {
    return <OrganizationAccessErrorState error={bootstrapError} />
  }

  return (
    <Shell>
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-5 md:gap-8">
        <div className="flex max-w-3xl flex-col gap-3">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {m.organization_create_eyebrow()}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {m.organization_create_title()}
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
            {m.organization_create_description()}
          </p>
        </div>

        <Card size="sm" className="max-w-2xl sm:py-6">
          <CardHeader>
            <CardTitle>{m.organization_create_card_title()}</CardTitle>
            <CardDescription>
              {m.organization_create_card_description()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateOrganizationForm
              onCreated={() => {
                navigate({ to: "/dashboard", replace: true })
              }}
              copy={{
                nameLabel: m.organization_create_name_label(),
                nameDescription: m.organization_create_name_description(),
                slugLabel: m.organization_create_slug_label(),
                slugDescription: m.organization_create_slug_description(),
                submitLabel: m.organization_create_submit(),
                submittingLabel: m.organization_create_submitting(),
                genericError: m.organization_create_generic_error(),
                errorTitle: m.organization_create_error_title(),
              }}
            />
          </CardContent>
        </Card>
      </section>
    </Shell>
  )
}

export function CreateOrganizationPage() {
  return <CreateOrganizationPageContent />
}
