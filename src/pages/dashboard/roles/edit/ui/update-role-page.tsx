"use client"

import { ArrowLeft01Icon, UserShield01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Link, useNavigate } from "@tanstack/react-router"

import { UpdateRoleForm } from "@/features/organizations/roles/ui/update-role-form"
import { useOrganizationRoleQuery } from "@/features/organizations/roles/model/queries"
import { useCurrentUserQuery } from "@/shared/auth/model/current-user"
import { PermissionGate } from "@/shared/auth/ui/permission-gate"
import { m } from "@/shared/i18n"
import { Button } from "@/shared/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/shared/ui/empty"
import { Spinner } from "@/shared/ui/spinner"

type UpdateRolePageProps = {
  roleId: string
}

function UpdateRoleLoadingState() {
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

function UpdateRoleNoAccessState() {
  return (
    <section className="flex min-h-[50svh] items-center justify-center rounded-3xl border border-border/70 bg-background/70 px-6 py-12">
      <Card className="w-full max-w-xl bg-card/80">
        <CardHeader>
          <div className="flex size-11 items-center justify-center rounded-2xl border border-border bg-background text-foreground shadow-xs">
            <HugeiconsIcon icon={UserShield01Icon} strokeWidth={2} />
          </div>
          <CardTitle>{m.roles_update_no_access_title()}</CardTitle>
          <CardDescription>{m.roles_update_no_access_description()}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-start">
          <Button className="w-full sm:w-auto" variant="outline" render={<Link to="/dashboard/roles" />}>
            <HugeiconsIcon
              icon={ArrowLeft01Icon}
              strokeWidth={2}
              data-icon="inline-start"
            />
            {m.roles_update_back_roles()}
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}

function UpdateRoleErrorState({ error }: { error: Error }) {
  return (
    <Empty className="border-border/70 bg-background/70 px-6 py-12">
      <EmptyHeader>
        <div className="flex size-11 items-center justify-center rounded-2xl border border-border bg-background text-foreground shadow-xs">
          <HugeiconsIcon icon={UserShield01Icon} strokeWidth={2} />
        </div>
        <EmptyContent>
          <EmptyTitle>{m.roles_update_error_title()}</EmptyTitle>
          <EmptyDescription>{error.message || m.roles_update_generic_error()}</EmptyDescription>
        </EmptyContent>
      </EmptyHeader>
      <Button className="w-full sm:w-auto" variant="outline" render={<Link to="/dashboard/roles" />}>
        <HugeiconsIcon
          icon={ArrowLeft01Icon}
          strokeWidth={2}
          data-icon="inline-start"
        />
        {m.roles_update_back_roles()}
      </Button>
    </Empty>
  )
}

function UpdateRoleNotFoundState() {
  return (
    <Empty className="border-border/70 bg-background/70 px-6 py-12">
      <EmptyHeader>
        <div className="flex size-11 items-center justify-center rounded-2xl border border-border bg-background text-foreground shadow-xs">
          <HugeiconsIcon icon={UserShield01Icon} strokeWidth={2} />
        </div>
        <EmptyContent>
          <EmptyTitle>{m.roles_update_not_found_title()}</EmptyTitle>
          <EmptyDescription>{m.roles_update_not_found_description()}</EmptyDescription>
        </EmptyContent>
      </EmptyHeader>
      <Button className="w-full sm:w-auto" variant="outline" render={<Link to="/dashboard/roles" />}>
        <HugeiconsIcon
          icon={ArrowLeft01Icon}
          strokeWidth={2}
          data-icon="inline-start"
        />
        {m.roles_update_back_roles()}
      </Button>
    </Empty>
  )
}

export function UpdateRolePage({ roleId }: UpdateRolePageProps) {
  return (
    <PermissionGate
      resource="ac"
      action="update"
      pendingFallback={<UpdateRoleLoadingState />}
      fallback={<UpdateRoleNoAccessState />}
    >
      <UpdateRolePageContent roleId={roleId} />
    </PermissionGate>
  )
}

function UpdateRolePageContent({ roleId }: UpdateRolePageProps) {
  const navigate = useNavigate()
  const currentUserState = useCurrentUserQuery()
  const organizationId =
    currentUserState.data?.session.activeOrganizationId ?? null

  if (currentUserState.isPending) {
    return <UpdateRoleLoadingState />
  }

  if (!organizationId) {
    return <UpdateRoleNotFoundState />
  }

  const roleQuery = useOrganizationRoleQuery({
    organizationId,
    roleId,
    enabled: Boolean(currentUserState.data),
  })

  if (roleQuery.isPending) {
    return <UpdateRoleLoadingState />
  }

  if (roleQuery.error) {
    return <UpdateRoleErrorState error={roleQuery.error} />
  }

  const role = roleQuery.data

  if (!role) {
    return <UpdateRoleNotFoundState />
  }

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
                {m.roles_update_eyebrow()}
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {m.roles_update_title()}
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
                {m.roles_update_description()}
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
          {m.roles_update_back_roles()}
        </Button>
      </div>

      <UpdateRoleForm
        role={role}
        organizationId={organizationId}
        copy={{
          cardTitle: m.roles_update_card_title(),
          cardDescription: m.roles_update_card_description(),
          roleLabel: m.roles_update_role_label(),
          roleDescription: m.roles_update_role_description(),
          rolePlaceholder: m.roles_update_role_placeholder(),
          permissionsLabel: m.roles_update_permissions_label(),
          permissionsDescription: m.roles_update_permissions_description(),
          submitLabel: m.roles_update_submit(),
          submittingLabel: m.roles_update_submitting(),
          errorTitle: m.roles_update_error_title(),
          genericError: m.roles_update_generic_error(),
        }}
        onSuccess={async () => {
          await navigate({
            to: "/dashboard/roles",
            replace: true,
          })
        }}
      />
    </section>
  )
}
