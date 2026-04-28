"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { MoreHorizontalCircle01Icon } from "@hugeicons/core-free-icons"
import { Link } from "@tanstack/react-router"

import type { OrganizationMemberSummary } from "../model/types"
import {
  formatMemberRoleLabel,
  getMemberAvatarFallback,
  getMemberAvatarSource,
  getMemberDisplayName,
  getMemberEmail,
} from "../lib/member-labels"
import { m } from "@/shared/i18n"
import { cn } from "@/shared/lib/utils"
import { Badge } from "@/shared/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
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

type OrganizationMemberItemProps = {
  member: OrganizationMemberSummary
  canEdit?: boolean
  onRemove?: (member: OrganizationMemberSummary) => void
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

export function OrganizationMemberItem({
  member,
  canEdit = false,
  onRemove,
}: OrganizationMemberItemProps) {
  const displayName = getMemberDisplayName(member)
  const email = getMemberEmail(member)
  const avatarSource = getMemberAvatarSource(member)
  const avatarFallback = getMemberAvatarFallback(member)
  const joinedDate = formatJoinedDate(member.createdAt)
  const hasActions = canEdit || Boolean(onRemove)

  return (
    <Item variant="outline" size="sm" className="items-start">
      <ItemMedia className="pt-0.5">
        <Avatar size="sm" className="size-10">
          <AvatarImage src={avatarSource ?? undefined} alt={displayName} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
      </ItemMedia>

      <ItemContent className="min-w-0">
        <ItemHeader className="items-start">
          <div className="min-w-0">
            <ItemTitle className="truncate">{displayName}</ItemTitle>
            {email ? (
              <ItemDescription className="truncate">{email}</ItemDescription>
            ) : (
              <ItemDescription className="truncate text-muted-foreground/80">
                {member.userId}
              </ItemDescription>
            )}
          </div>

          <ItemActions className="shrink-0 items-center gap-2">
            <Badge variant="outline" className="uppercase">
              {formatMemberRoleLabel(member.role)}
            </Badge>

            {hasActions ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  aria-label={m.members_more_label()}
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
                          to="/dashboard/members/$memberId/edit"
                          params={{ memberId: member.id }}
                        />
                      }
                    >
                      <span>{m.members_edit_action()}</span>
                    </DropdownMenuItem>
                  ) : null}

                  {canEdit && onRemove ? <DropdownMenuSeparator /> : null}

                  {onRemove ? (
                    <DropdownMenuItem
                      variant="destructive"
                      className="w-full justify-start rounded-xl px-3 py-2"
                      onClick={() => {
                        onRemove(member)
                      }}
                    >
                      <span>{m.members_remove_action()}</span>
                    </DropdownMenuItem>
                  ) : null}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </ItemActions>
        </ItemHeader>

        <ItemFooter className={cn("justify-start text-xs text-muted-foreground")}>
          {joinedDate ? (
            <span>
              {m.members_joined_label()} {joinedDate}
            </span>
          ) : (
            <span>{m.members_joined_unknown()}</span>
          )}
        </ItemFooter>
      </ItemContent>
    </Item>
  )
}
