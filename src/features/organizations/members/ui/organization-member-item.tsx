"use client"

import type { OrganizationMemberSummary } from "../model/members"

import { m } from "@/shared/i18n"
import { cn } from "@/shared/lib/utils"
import { Badge } from "@/shared/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/shared/ui/item"

function getInitials(value: string) {
  const parts = value.trim().split(/\s+/).filter(Boolean)

  const initials = parts.slice(0, 2).map((part) => part[0]).join("")

  return (initials || value.trim().slice(0, 2) || "M").toUpperCase()
}

function formatRoleLabel(role: OrganizationMemberSummary["role"]) {
  if (Array.isArray(role)) {
    return role.join(", ")
  }

  return role ?? "member"
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

type OrganizationMemberItemProps = {
  member: OrganizationMemberSummary
}

export function OrganizationMemberItem({ member }: OrganizationMemberItemProps) {
  const user = member.user
  const displayName =
    user?.name?.trim() ||
    user?.email?.split("@")[0]?.trim() ||
    member.name?.trim() ||
    member.email?.split("@")[0]?.trim() ||
    member.userId ||
    "Member"
  const email = user?.email?.trim() || member.email?.trim() || null
  const avatarSource = user?.image || member.image || null
  const avatarFallback = getInitials(displayName)
  const joinedDate = formatJoinedDate(member.createdAt)

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

          <Badge variant="outline" className="uppercase">
            {formatRoleLabel(member.role)}
          </Badge>
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
