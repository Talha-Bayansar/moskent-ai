"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  UserGroupIcon,
  UserSearchIcon,
  UserTimeIcon,
} from "@hugeicons/core-free-icons"

import type { OrganizationMemberSummary } from "@/features/organizations/members/model/members"
import { useOrganizationMembersInfiniteQuery } from "@/features/organizations/members/model/members"
import { authClient } from "@/shared/auth/auth-client"
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
import { Spinner } from "@/shared/ui/spinner"
import { OrganizationMemberItem } from "@/features/organizations/members/ui/organization-member-item"
import { Skeleton } from "@/shared/ui/skeleton"

function MembersLoadingState() {
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

function MembersEmptyState() {
  return (
    <Empty className="border-border/70 bg-background/70 px-6 py-12">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <HugeiconsIcon icon={UserSearchIcon} strokeWidth={2} />
        </EmptyMedia>
        <EmptyContent>
          <EmptyTitle>{m.members_empty_title()}</EmptyTitle>
          <EmptyDescription>{m.members_empty_description()}</EmptyDescription>
        </EmptyContent>
      </EmptyHeader>
    </Empty>
  )
}

function MembersErrorState({ error }: { error: Error }) {
  return (
    <Empty className="border-border/70 bg-background/70 px-6 py-12">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <HugeiconsIcon icon={UserTimeIcon} strokeWidth={2} />
        </EmptyMedia>
        <EmptyContent>
          <EmptyTitle>{m.members_error_title()}</EmptyTitle>
          <EmptyDescription>{error.message || m.members_error_description()}</EmptyDescription>
        </EmptyContent>
      </EmptyHeader>
    </Empty>
  )
}

export function MembersPage() {
  const sessionState = authClient.useSession()
  const organizationId = sessionState.data?.session.activeOrganizationId ?? null
  const membersQuery = useOrganizationMembersInfiniteQuery({
    organizationId,
    enabled: Boolean(sessionState.data),
  })

  const members = membersQuery.data?.pages.flatMap((page) => page.members) ?? []

  const error = membersQuery.error

  return (
    <section className="flex flex-col gap-5 md:gap-8">
      <div className="flex max-w-3xl flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl border border-border bg-background text-foreground shadow-xs">
            <HugeiconsIcon icon={UserGroupIcon} strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {m.members_title()}
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
              {m.members_description()}
            </p>
          </div>
        </div>
      </div>

      <InfiniteScrollList<OrganizationMemberSummary>
        items={members}
        keyExtractor={(member) => member.id}
        renderItem={(member) => <OrganizationMemberItem member={member} />}
        hasNextPage={membersQuery.hasNextPage}
        isFetchingNextPage={membersQuery.isFetchingNextPage}
        isPending={membersQuery.isPending}
        error={error}
        onLoadMore={() => {
          if (membersQuery.hasNextPage && !membersQuery.isFetchingNextPage) {
            void membersQuery.fetchNextPage()
          }
        }}
        className="gap-4"
        loadingState={<MembersLoadingState />}
        emptyState={<MembersEmptyState />}
        errorState={error ? <MembersErrorState error={error} /> : null}
      />
    </section>
  )
}
