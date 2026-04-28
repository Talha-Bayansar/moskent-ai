"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { UserShield01Icon } from "@hugeicons/core-free-icons"

import { baselineOrganizationRoleNames } from "@/shared/auth/permissions"
import { m } from "@/shared/i18n"
import { cn } from "@/shared/lib/utils"
import { Badge } from "@/shared/ui/badge"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/shared/ui/item"
import type { OrganizationRoleSummary } from "../model/types"

function formatRoleLabel(role: string) {
  return role.trim() || "member"
}

function formatJoinedDate(value?: string | Date | null) {
  if (!value) {
    return null
  }

  const date = value instanceof Date ? value : new Date(value)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  }).format(date)
}

function formatPermissionSummary(
  permission: OrganizationRoleSummary["permission"]
) {
  const resources = Object.keys(permission)
  const actionCount = resources.reduce((total, resource) => {
    return total + permission[resource].length
  }, 0)

  if (resources.length === 0) {
    return m.roles_permissions_none()
  }

  return `${resources.length} ${m.roles_permission_resources_label()} · ${actionCount} ${m.roles_permission_actions_label()}`
}

type OrganizationRoleItemProps = {
  role: OrganizationRoleSummary
}

export function OrganizationRoleItem({ role }: OrganizationRoleItemProps) {
  const joinedDate = formatJoinedDate(role.createdAt)
  const isBaselineRole = baselineOrganizationRoleNames.includes(
    role.role as (typeof baselineOrganizationRoleNames)[number]
  )

  return (
    <Item variant="outline" size="sm" className="items-start">
      <ItemMedia className="pt-0.5">
        <div className="flex size-10 items-center justify-center rounded-2xl border border-border bg-background text-foreground shadow-xs">
          <HugeiconsIcon icon={UserShield01Icon} strokeWidth={2} />
        </div>
      </ItemMedia>

      <ItemContent className="min-w-0">
        <ItemHeader className="items-start gap-3">
          <div className="min-w-0">
            <ItemTitle className="truncate">{formatRoleLabel(role.role)}</ItemTitle>
            <ItemDescription className="truncate">
              {m.roles_permissions_label()} {formatPermissionSummary(role.permission)}
            </ItemDescription>
          </div>

          <Badge variant="outline" className="uppercase">
            {isBaselineRole ? m.roles_default_badge() : m.roles_custom_badge()}
          </Badge>
        </ItemHeader>

        <ItemFooter
          className={cn("justify-start text-xs text-muted-foreground")}
        >
          {joinedDate ? (
            <span>
              {m.roles_created_label()} {joinedDate}
            </span>
          ) : (
            <span>{m.roles_created_unknown()}</span>
          )}
        </ItemFooter>
      </ItemContent>
    </Item>
  )
}
