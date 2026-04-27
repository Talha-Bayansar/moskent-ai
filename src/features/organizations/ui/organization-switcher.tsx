"use client"

import {
  useOrganizationsQuery,
  useSetActiveOrganizationMutation,
} from "../model/organizations"
import { useAuthSessionQuery } from "@/shared/auth/session"

import { Link } from "@tanstack/react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import { UserAdd01Icon } from "@hugeicons/core-free-icons"

import { m } from "@/shared/i18n"
import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"
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
  const sessionState = useAuthSessionQuery()
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
    <div className={cn("flex flex-col gap-2", className)}>
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
          className="w-full rounded-lg border-sidebar-border bg-sidebar-accent/40 text-sidebar-foreground hover:bg-sidebar-accent focus-visible:ring-sidebar-ring"
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

      <Button
        render={<Link to="/organizations/new" />}
        variant="outline"
        size="sm"
        className="w-full justify-start gap-2 border-sidebar-border bg-sidebar-accent/20 text-sidebar-foreground hover:bg-sidebar-accent"
      >
        <HugeiconsIcon icon={UserAdd01Icon} strokeWidth={2} />
        <span>{m.organization_create_submit()}</span>
      </Button>
    </div>
  )
}
