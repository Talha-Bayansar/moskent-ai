"use client"

import type { OrganizationInvitationSummary } from "../model/types"

import { m } from "@/shared/i18n"
import { cn } from "@/shared/lib/utils"
import { Badge } from "@/shared/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import { Button } from "@/shared/ui/button"
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

type OrganizationInvitationItemProps = {
  invitation: OrganizationInvitationSummary
  onAccept: (invitation: OrganizationInvitationSummary) => void
  onReject: (invitation: OrganizationInvitationSummary) => void
}

function getInitials(value: string) {
  const parts = value.trim().split(/\s+/).filter(Boolean)

  const initials = parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")

  return (initials || value.trim().slice(0, 2) || "O").toUpperCase()
}

function formatRoleLabel(role: OrganizationInvitationSummary["role"]) {
  if (Array.isArray(role)) {
    return role.join(", ")
  }

  return role ?? "member"
}

function formatDate(value?: string | Date | null) {
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

export function OrganizationInvitationItem({
  invitation,
  onAccept,
  onReject,
}: OrganizationInvitationItemProps) {
  const organizationName =
    invitation.organizationName?.trim() ||
    invitation.organization?.name?.trim() ||
    null
  const organizationLabel =
    organizationName || m.organization_invitations_unknown_organization()
  const inviterName =
    invitation.inviter?.user?.name?.trim() ||
    invitation.inviter?.user?.email?.trim() ||
    invitation.email?.trim() ||
    null
  const invitationDate = formatDate(invitation.createdAt)
  const expiryDate = formatDate(invitation.expiresAt)
  const avatarFallback = getInitials(organizationLabel)

  return (
    <Item variant="outline" size="sm" className="items-start">
      <ItemMedia className="pt-0.5">
        <Avatar size="sm" className="size-10 shrink-0">
          <AvatarImage src={undefined} alt={organizationLabel} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
      </ItemMedia>

      <ItemContent className="min-w-0">
        <ItemHeader className="items-start">
          <div className="min-w-0 flex-1">
            <ItemTitle className="truncate">{organizationLabel}</ItemTitle>
            <ItemDescription className="truncate">
              {m.organization_invitations_pending_description()}
            </ItemDescription>
          </div>

          <Badge variant="outline" className="shrink-0 uppercase">
            {m.organization_invitations_pending_badge()}
          </Badge>
        </ItemHeader>

        <ItemDescription className="flex min-w-0 flex-col gap-1 text-sm">
          <span className="truncate">
            {m.organization_invitations_role_label()}{" "}
            {formatRoleLabel(invitation.role)}
          </span>
          <span className="truncate">
            {m.organization_invitations_invited_by_label()} {inviterName}
          </span>
        </ItemDescription>

        <ItemFooter className={cn("flex-wrap justify-between gap-3 text-xs")}>
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-muted-foreground">
            {invitationDate ? (
              <span className="truncate">
                {m.organization_invitations_sent_label()} {invitationDate}
              </span>
            ) : null}
            {expiryDate ? (
              <span className="truncate">
                {m.organization_invitations_expires_label()} {expiryDate}
              </span>
            ) : null}
          </div>

          <ItemActions className="flex-wrap justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onReject(invitation)
              }}
            >
              {m.organization_invitations_reject_action()}
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                onAccept(invitation)
              }}
            >
              {m.organization_invitations_accept_action()}
            </Button>
          </ItemActions>
        </ItemFooter>
      </ItemContent>
    </Item>
  )
}
