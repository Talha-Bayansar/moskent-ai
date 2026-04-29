"use client"

import { ArrowLeft01Icon, UserEdit01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Link, useNavigate } from "@tanstack/react-router"

import { UpdateMemberForm } from "@/features/organizations/members/ui/update-member-form"
import { useOrganizationMemberQuery } from "@/features/organizations/members/model/queries"
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
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/shared/ui/empty"
import { Spinner } from "@/shared/ui/spinner"

type UpdateMemberPageProps = {
  memberId: string
}

function UpdateMemberLoadingState() {
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

function UpdateMemberNoAccessState() {
  return (
    <section className="flex min-h-[50svh] items-center justify-center rounded-3xl border border-border/70 bg-background/70 px-6 py-12">
      <Card className="w-full max-w-xl bg-card/80">
        <CardHeader>
          <div className="flex size-11 items-center justify-center rounded-2xl border border-border bg-background text-foreground shadow-xs">
            <HugeiconsIcon icon={UserEdit01Icon} strokeWidth={2} />
          </div>
          <CardTitle>{m.members_edit_no_access_title()}</CardTitle>
          <CardDescription>{m.members_edit_no_access_description()}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-start">
          <Button className="w-full sm:w-auto" render={<Link to="/dashboard/members" />}>
            <HugeiconsIcon
              icon={ArrowLeft01Icon}
              strokeWidth={2}
              data-icon="inline-start"
            />
            {m.members_edit_back_members()}
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}

function UpdateMemberErrorState({ error }: { error: Error }) {
  return (
    <Empty className="border-border/70 bg-background/70 px-6 py-12">
      <EmptyHeader>
        <div className="flex size-11 items-center justify-center rounded-2xl border border-border bg-background text-foreground shadow-xs">
          <HugeiconsIcon icon={UserEdit01Icon} strokeWidth={2} />
        </div>
        <EmptyContent>
          <EmptyTitle>{m.members_edit_error_title()}</EmptyTitle>
          <EmptyDescription>{error.message || m.members_edit_generic_error()}</EmptyDescription>
        </EmptyContent>
      </EmptyHeader>
      <Button className="w-full sm:w-auto" variant="outline" render={<Link to="/dashboard/members" />}>
        <HugeiconsIcon
          icon={ArrowLeft01Icon}
          strokeWidth={2}
          data-icon="inline-start"
        />
        {m.members_edit_back_members()}
      </Button>
    </Empty>
  )
}

function UpdateMemberNotFoundState() {
  return (
    <Empty className="border-border/70 bg-background/70 px-6 py-12">
      <EmptyHeader>
        <div className="flex size-11 items-center justify-center rounded-2xl border border-border bg-background text-foreground shadow-xs">
          <HugeiconsIcon icon={UserEdit01Icon} strokeWidth={2} />
        </div>
        <EmptyContent>
          <EmptyTitle>{m.members_edit_not_found_title()}</EmptyTitle>
          <EmptyDescription>{m.members_edit_not_found_description()}</EmptyDescription>
        </EmptyContent>
      </EmptyHeader>
      <Button className="w-full sm:w-auto" variant="outline" render={<Link to="/dashboard/members" />}>
        <HugeiconsIcon
          icon={ArrowLeft01Icon}
          strokeWidth={2}
          data-icon="inline-start"
        />
        {m.members_edit_back_members()}
      </Button>
    </Empty>
  )
}

export function UpdateMemberPage({ memberId }: UpdateMemberPageProps) {
  return (
    <PermissionGate
      resource="member"
      action="update"
      pendingFallback={<UpdateMemberLoadingState />}
      fallback={<UpdateMemberNoAccessState />}
    >
      <UpdateMemberPageContent memberId={memberId} />
    </PermissionGate>
  )
}

function UpdateMemberPageContent({ memberId }: UpdateMemberPageProps) {
  const navigate = useNavigate()
  const currentUserState = useCurrentUserQuery()
  const organizationId =
    currentUserState.data?.session.activeOrganizationId ?? null
  const memberQuery = useOrganizationMemberQuery({
    organizationId,
    memberId,
    enabled: Boolean(currentUserState.data),
  })

  const isPending = currentUserState.isPending || memberQuery.isPending
  const member = memberQuery.data

  if (isPending) {
    return <UpdateMemberLoadingState />
  }

  if (memberQuery.error) {
    return <UpdateMemberErrorState error={memberQuery.error} />
  }

  if (!member) {
    return <UpdateMemberNotFoundState />
  }

  return (
    <section className="flex flex-col gap-5 md:gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="flex max-w-3xl flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl border border-border bg-background text-foreground shadow-xs">
              <HugeiconsIcon icon={UserEdit01Icon} strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                {m.members_edit_eyebrow()}
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {m.members_edit_title()}
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
                {m.members_edit_description()}
              </p>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full sm:w-auto"
          render={<Link to="/dashboard/members" />}
        >
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            strokeWidth={2}
            data-icon="inline-start"
          />
          {m.members_edit_back_members()}
        </Button>
      </div>

      <UpdateMemberForm
        member={member}
        organizationId={organizationId}
        onSuccess={async () => {
          await navigate({
            to: "/dashboard/members",
            replace: true,
          })
        }}
        copy={{
          cardTitle: m.members_edit_card_title(),
          cardDescription: m.members_edit_card_description(),
          roleLabel: m.members_edit_role_label(),
          roleDescription: m.members_edit_role_description(),
          roleSelectPlaceholder: m.members_edit_role_placeholder(),
          roleSelectSearchPlaceholder: m.members_edit_role_search_placeholder(),
          roleSelectLoadingLabel: m.members_edit_role_loading(),
          roleSelectEmptyLabel: m.members_edit_role_empty(),
          submitLabel: m.members_edit_submit(),
          submittingLabel: m.members_edit_submitting(),
          errorTitle: m.members_edit_error_title(),
          genericError: m.members_edit_generic_error(),
        }}
      />
    </section>
  )
}
