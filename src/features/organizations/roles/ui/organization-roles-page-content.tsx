"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  UserSearch01Icon,
  UserShield01Icon,
  UserTime03Icon,
} from "@hugeicons/core-free-icons"

import { useOrganizationRolesInfiniteQuery } from "../model/queries"
import { OrganizationRoleItem } from "./organization-role-item"
import type { OrganizationRoleSummary } from "../model/types"
import { useCurrentUserQuery } from "@/shared/auth/model/current-user"
import { m } from "@/shared/i18n"
import { InfiniteScrollList } from "@/shared/ui/infinite-scroll-list"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/ui/empty"
import { ItemGroup } from "@/shared/ui/item"
import { Skeleton } from "@/shared/ui/skeleton"
import { Spinner } from "@/shared/ui/spinner"

function RolesLoadingState() {
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
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background px-4 py-3"
          >
            <Skeleton className="size-10 rounded-2xl" />
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

function RolesEmptyState() {
  return (
    <Empty className="border-border/70 bg-background/70 px-6 py-12">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <HugeiconsIcon icon={UserSearch01Icon} strokeWidth={2} />
        </EmptyMedia>
        <EmptyContent>
          <EmptyTitle>{m.roles_empty_title()}</EmptyTitle>
          <EmptyDescription>{m.roles_empty_description()}</EmptyDescription>
        </EmptyContent>
      </EmptyHeader>
    </Empty>
  )
}

function RolesErrorState({ error }: { error: Error }) {
  return (
    <Empty className="border-border/70 bg-background/70 px-6 py-12">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <HugeiconsIcon icon={UserTime03Icon} strokeWidth={2} />
        </EmptyMedia>
        <EmptyContent>
          <EmptyTitle>{m.roles_error_title()}</EmptyTitle>
          <EmptyDescription>
            {error.message || m.roles_error_description()}
          </EmptyDescription>
        </EmptyContent>
      </EmptyHeader>
    </Empty>
  )
}

export function OrganizationRolesPageContent() {
  const currentUserState = useCurrentUserQuery()
  const organizationId =
    currentUserState.data?.session.activeOrganizationId ?? null
  const rolesQuery = useOrganizationRolesInfiniteQuery({
    organizationId,
    enabled: Boolean(currentUserState.data),
  })

  const roles = rolesQuery.data?.pages.flatMap((page) => page.roles) ?? []
  const error = rolesQuery.error

  return (
    <section className="flex flex-col gap-5 md:gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="flex max-w-3xl flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl border border-border bg-background text-foreground shadow-xs">
              <HugeiconsIcon icon={UserShield01Icon} strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {m.roles_title()}
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
                {m.roles_description()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <InfiniteScrollList<OrganizationRoleSummary>
        items={roles}
        keyExtractor={(role) => role.id}
        renderItem={(role) => <OrganizationRoleItem role={role} />}
        hasNextPage={rolesQuery.hasNextPage}
        isFetchingNextPage={rolesQuery.isFetchingNextPage}
        isPending={rolesQuery.isPending}
        error={error}
        onLoadMore={() => {
          if (rolesQuery.hasNextPage && !rolesQuery.isFetchingNextPage) {
            void rolesQuery.fetchNextPage()
          }
        }}
        className="gap-4"
        loadingState={<RolesLoadingState />}
        emptyState={<RolesEmptyState />}
        errorState={error ? <RolesErrorState error={error} /> : null}
      />
    </section>
  )
}
