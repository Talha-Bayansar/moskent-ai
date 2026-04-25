"use client"

import {
  useOrganizationsQuery,
  useSetActiveOrganizationMutation,
} from "../model/organizations"

import { authClient } from "@/shared/auth/auth-client"
import { m } from "@/shared/i18n"
import { cn } from "@/shared/lib/utils"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"

type OrganizationSwitcherProps = {
  className?: string
}

export function OrganizationSwitcher({ className }: OrganizationSwitcherProps) {
  const sessionState = authClient.useSession()
  const activeOrganizationId =
    sessionState.data?.session.activeOrganizationId ?? null
  const organizationsQuery = useOrganizationsQuery({
    enabled: Boolean(sessionState.data),
  })
  const setActiveOrganizationMutation = useSetActiveOrganizationMutation()

  const organizations = organizationsQuery.data ?? []
  const selectedOrganizationId =
    setActiveOrganizationMutation.variables ?? activeOrganizationId
  const selectedOrganization = organizations.find(
    (organization) => organization.id === selectedOrganizationId
  )
  const isDisabled =
    organizationsQuery.isPending ||
    setActiveOrganizationMutation.isPending ||
    organizations.length === 0

  return (
    <Select
      value={selectedOrganizationId}
      onValueChange={(organizationId) => {
        if (
          typeof organizationId !== "string" ||
          organizationId === activeOrganizationId
        ) {
          return
        }

        setActiveOrganizationMutation.mutate(organizationId)
      }}
      disabled={isDisabled}
    >
      <SelectTrigger
        aria-label={m.organization_switcher_label()}
        className={cn(
          "w-full rounded-lg border-sidebar-border bg-sidebar-accent/40 text-sidebar-foreground hover:bg-sidebar-accent focus-visible:ring-sidebar-ring",
          className
        )}
      >
        <SelectValue placeholder={m.organization_switcher_loading()}>
          {() => (
            <span className="truncate text-sm font-medium">
              {selectedOrganization?.name ??
                (organizationsQuery.isPending
                  ? m.organization_switcher_loading()
                  : m.organization_switcher_empty())}
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent align="start" className="min-w-60">
        <SelectGroup>
          {organizations.map((organization) => (
            <SelectItem
              key={organization.id}
              value={organization.id}
              label={organization.name}
            >
              <span className="truncate font-medium">{organization.name}</span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
