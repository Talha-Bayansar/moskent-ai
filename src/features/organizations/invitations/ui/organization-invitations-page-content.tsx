"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import {
  UserSearchIcon,
  UserTimeIcon,
} from "@hugeicons/core-free-icons"

import {
  useAcceptOrganizationInvitationMutation,
  useRejectOrganizationInvitationMutation,
} from "../model/mutations"
import { useUserOrganizationInvitationsQuery } from "../model/queries"
import { InvitationActionDialog } from "./invitation-action-dialog"
import { OrganizationInvitationItem } from "./organization-invitation-item"
import type { OrganizationInvitationSummary } from "../model/types"
import { useCurrentUserQuery } from "@/shared/auth/model/current-user"
import { m } from "@/shared/i18n"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/shared/ui/empty"
import { InfiniteScrollList } from "@/shared/ui/infinite-scroll-list"
import { ItemGroup } from "@/shared/ui/item"
import { Skeleton } from "@/shared/ui/skeleton"
import { Spinner } from "@/shared/ui/spinner"

type InvitationActionState = {
  invitation: OrganizationInvitationSummary
  action: "accept" | "reject"
}

function InvitationsLoadingState() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Spinner className="size-5" />
        <div className="space-y-2">
          <div className="h-4 w-32 rounded-full bg-muted" />
          <div className="h-3 w-56 rounded-full bg-muted" />
        </div>
      </div>

      <ItemGroup className="gap-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background px-4 py-3"
          >
            <Skeleton className="size-10 rounded-full" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-56" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
        ))}
      </ItemGroup>
    </div>
  )
}

function InvitationsEmptyState() {
  return (
    <Empty className="border-border/70 bg-background/70 px-6 py-12">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <HugeiconsIcon icon={UserSearchIcon} strokeWidth={2} />
        </EmptyMedia>
        <EmptyContent>
          <EmptyTitle>{m.organization_invitations_empty_title()}</EmptyTitle>
          <EmptyDescription>
            {m.organization_invitations_empty_description()}
          </EmptyDescription>
        </EmptyContent>
      </EmptyHeader>
    </Empty>
  )
}

function InvitationsErrorState({ error }: { error: Error }) {
  return (
    <Empty className="border-border/70 bg-background/70 px-6 py-12">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <HugeiconsIcon icon={UserTimeIcon} strokeWidth={2} />
        </EmptyMedia>
        <EmptyContent>
          <EmptyTitle>{m.organization_invitations_error_title()}</EmptyTitle>
          <EmptyDescription>
            {error.message || m.organization_invitations_error_description()}
          </EmptyDescription>
        </EmptyContent>
      </EmptyHeader>
    </Empty>
  )
}

export function OrganizationInvitationsPageContent() {
  const navigate = useNavigate()
  const currentUserState = useCurrentUserQuery()
  const invitationsQuery = useUserOrganizationInvitationsQuery({
    enabled: Boolean(currentUserState.data),
  })
  const acceptInvitationMutation = useAcceptOrganizationInvitationMutation()
  const rejectInvitationMutation = useRejectOrganizationInvitationMutation()
  const [actionState, setActionState] = useState<InvitationActionState | null>(
    null
  )
  const [actionError, setActionError] = useState<string | null>(null)

  const invitations = invitationsQuery.data ?? []
  const activeMutation =
    actionState?.action === "accept"
      ? acceptInvitationMutation
      : actionState?.action === "reject"
        ? rejectInvitationMutation
        : null

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-5 md:gap-8">
      <div className="flex flex-col gap-3">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {m.organization_access_eyebrow()}
        </p>
        <div className="flex max-w-3xl flex-col gap-3">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {m.organization_invitations_section_title()}
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
            {m.organization_invitations_section_description()}
          </p>
        </div>
      </div>

      <InfiniteScrollList<OrganizationInvitationSummary>
        items={invitations}
        keyExtractor={(invitation) => invitation.id}
        renderItem={(invitation) => (
          <OrganizationInvitationItem
            invitation={invitation}
            onAccept={(nextInvitation) => {
              setActionError(null)
              setActionState({
                invitation: nextInvitation,
                action: "accept",
              })
            }}
            onReject={(nextInvitation) => {
              setActionError(null)
              setActionState({
                invitation: nextInvitation,
                action: "reject",
              })
            }}
          />
        )}
        hasNextPage={false}
        isPending={invitationsQuery.isPending}
        error={invitationsQuery.error}
        onLoadMore={() => undefined}
        className="gap-4"
        loadingState={<InvitationsLoadingState />}
        emptyState={<InvitationsEmptyState />}
        errorState={
          invitationsQuery.error ? (
            <InvitationsErrorState error={invitationsQuery.error} />
          ) : null
        }
      />

      <InvitationActionDialog
        invitation={actionState?.invitation ?? null}
        action={actionState?.action ?? null}
        open={Boolean(actionState)}
        error={actionError}
        isPending={activeMutation?.isPending ?? false}
        onOpenChange={(open) => {
          if (!open) {
            setActionState(null)
            setActionError(null)
            acceptInvitationMutation.reset()
            rejectInvitationMutation.reset()
          }
        }}
        onConfirm={async () => {
          if (!actionState) {
            return
          }

          setActionError(null)

          try {
            if (actionState.action === "accept") {
              await acceptInvitationMutation.mutateAsync(
                actionState.invitation.id
              )
              await navigate({
                to: "/dashboard",
                replace: true,
              })
            } else {
              await rejectInvitationMutation.mutateAsync(
                actionState.invitation.id
              )
            }

            setActionState(null)
            acceptInvitationMutation.reset()
            rejectInvitationMutation.reset()
          } catch (error) {
            const message =
              error instanceof Error
                ? error.message
                : m.organization_invitations_generic_error()

            setActionError(message)
          }
        }}
      />
    </section>
  )
}
