"use client"

import { ArrowLeft01Icon, UserShield01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Link } from "@tanstack/react-router"

import { CreateRoleForm } from "@/features/organizations/roles/ui/create-role-form"
import { useCurrentUserQuery } from "@/shared/auth/model/current-user"
import { PermissionGate } from "@/shared/auth/ui/permission-gate"
import { m } from "@/shared/i18n"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { Spinner } from "@/shared/ui/spinner"

export function CreateRolePage() {
  return (
    <PermissionGate
      resource="ac"
      action="create"
      pendingFallback={<CreateRoleLoadingState />}
      fallback={<CreateRoleNoAccessState />}
    >
      <CreateRolePageContent />
    </PermissionGate>
  )
}

function CreateRoleLoadingState() {
  return (
    <section className="flex min-h-[50svh] items-center justify-center rounded-3xl border border-border/70 bg-background/70 px-6 py-12">
      <div className="flex flex-col items-center gap-3 text-center">
        <Spinner className="size-6" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            {m.auth_checking_title()}
          </p>
          <p className="text-sm leading-6 text-muted-foreground">
            {m.auth_checking_description()}
          </p>
        </div>
      </div>
    </section>
  )
}

function CreateRoleNoAccessState() {
  return (
    <section className="flex min-h-[50svh] items-center justify-center rounded-3xl border border-border/70 bg-background/70 px-6 py-12">
      <Card className="w-full max-w-xl bg-card/80">
        <CardHeader>
          <div className="flex size-11 items-center justify-center rounded-2xl border border-border bg-background text-foreground shadow-xs">
            <HugeiconsIcon icon={UserShield01Icon} strokeWidth={2} />
          </div>
          <CardTitle>{m.roles_create_no_access_title()}</CardTitle>
          <CardDescription>
            {m.roles_create_no_access_description()}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-start">
          <Button className="w-full sm:w-auto" render={<Link to="/dashboard/roles" />}>
            <HugeiconsIcon
              icon={ArrowLeft01Icon}
              strokeWidth={2}
              data-icon="inline-start"
            />
            {m.roles_create_back_roles()}
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}

function CreateRolePageContent() {
  const currentUserState = useCurrentUserQuery()
  const organizationId = currentUserState.data?.session.activeOrganizationId ?? null

  return (
    <section className="flex flex-col gap-5 md:gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="flex max-w-3xl flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl border border-border bg-background text-foreground shadow-xs">
              <HugeiconsIcon icon={UserShield01Icon} strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                {m.roles_create_eyebrow()}
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {m.roles_create_title()}
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
                {m.roles_create_description()}
              </p>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full sm:w-auto"
          render={<Link to="/dashboard/roles" />}
        >
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            strokeWidth={2}
            data-icon="inline-start"
          />
          {m.roles_create_back_roles()}
        </Button>
      </div>

      <CreateRoleForm
        organizationId={organizationId}
        copy={{
          cardTitle: m.roles_create_card_title(),
          cardDescription: m.roles_create_card_description(),
          roleLabel: m.roles_create_role_label(),
          roleDescription: m.roles_create_role_description(),
          rolePlaceholder: m.roles_create_role_placeholder(),
          permissionsLabel: m.roles_create_permissions_label(),
          permissionsDescription: m.roles_create_permissions_description(),
          submitLabel: m.roles_create_submit(),
          submittingLabel: m.roles_create_submitting(),
          successTitle: m.roles_create_success_title(),
          successDescription: m.roles_create_success_description(),
          successBody: m.roles_create_success_body(),
          createAnotherLabel: m.roles_create_create_another(),
          backLabel: m.roles_create_back_roles(),
          errorTitle: m.roles_create_error_title(),
          genericError: m.roles_create_generic_error(),
        }}
      />
    </section>
  )
}
