"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  MoreHorizontalCircle01Icon,
  UserShield01Icon,
} from "@hugeicons/core-free-icons"
import { Link } from "@tanstack/react-router"

import type { OrganizationRoleSummary } from "../model/types"
import { m } from "@/shared/i18n"
import { cn } from "@/shared/lib/utils"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/shared/ui/item"
import { baselineOrganizationRoleNames } from "@/shared/auth/permissions"

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
  canEdit?: boolean
  canDelete?: boolean
  onDelete?: (role: OrganizationRoleSummary) => void
}

export function OrganizationRoleItem({
  role,
  canEdit = false,
  canDelete = false,
  onDelete,
}: OrganizationRoleItemProps) {
  const joinedDate = formatJoinedDate(role.createdAt)
  const isBaselineRole = baselineOrganizationRoleNames.includes(
    role.role as (typeof baselineOrganizationRoleNames)[number]
  )
  const hasActions =
    canEdit || (canDelete && !isBaselineRole && Boolean(onDelete))

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

          <ItemActions className="shrink-0 items-center gap-2">
            <Badge variant="outline" className="uppercase">
              {isBaselineRole ? m.roles_default_badge() : m.roles_custom_badge()}
            </Badge>

            {hasActions ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  aria-label={m.roles_more_label()}
                  render={
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="rounded-full"
                    />
                  }
                >
                  <HugeiconsIcon
                    icon={MoreHorizontalCircle01Icon}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="min-w-48">
                  {canEdit ? (
                    <DropdownMenuItem
                      className="w-full justify-start rounded-xl px-3 py-2"
                      render={
                        <Link
                          to="/dashboard/roles/$roleId/edit"
                          params={{ roleId: role.id }}
                        />
                      }
                    >
                      <span>{m.roles_edit_action()}</span>
                    </DropdownMenuItem>
                  ) : null}

                  {canEdit && canDelete && !isBaselineRole && onDelete ? (
                    <DropdownMenuSeparator />
                  ) : null}

                  {canDelete && !isBaselineRole && onDelete ? (
                    <DropdownMenuItem
                      variant="destructive"
                      className="w-full justify-start rounded-xl px-3 py-2"
                      onClick={() => {
                        onDelete(role)
                      }}
                    >
                      <span>{m.roles_delete_action()}</span>
                    </DropdownMenuItem>
                  ) : null}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </ItemActions>
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
