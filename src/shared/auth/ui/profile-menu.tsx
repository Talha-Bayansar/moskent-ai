"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDown01Icon, Logout01Icon } from "@hugeicons/core-free-icons"

import { SignOutButton } from "./sign-out-button"
import { authClient } from "@/shared/auth/auth-client"
import { m } from "@/shared/i18n"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import { Button } from "@/shared/ui/button"

function getInitials(value: string) {
  const parts = value
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  const initials = parts.slice(0, 2).map((part) => part[0]).join("")

  return (initials || value.trim().slice(0, 2) || "U").toUpperCase()
}

export function ProfileMenu() {
  const sessionState = authClient.useSession()
  const session = sessionState.data
  const user = session?.user
  const displayName = user
    ? user.name.trim() || user.email.split("@")[0]?.trim() || "Account"
    : "Account"
  const userEmail = user ? user.email.trim() : ""
  const avatarFallback = getInitials(
    user ? user.name.trim() || user.email : "User"
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={m.auth_profile_menu_label()}
        render={
          <Button
            variant="outline"
            className="h-auto w-full min-w-0 gap-2 rounded-3xl border-sidebar-border bg-sidebar-accent/40 px-2.5 py-2 text-left text-sidebar-foreground hover:bg-sidebar-accent focus-visible:ring-sidebar-ring"
          />
        }
      >
        <Avatar size="sm" className="size-8">
          <AvatarImage src={user?.image ?? undefined} alt={displayName} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>

        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium">
            {displayName}
          </span>
        </span>

        <HugeiconsIcon
          icon={ArrowDown01Icon}
          strokeWidth={2}
          className="pointer-events-none text-muted-foreground"
          aria-hidden="true"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-72 p-2">
        <div className="flex items-center gap-3 rounded-2xl bg-muted/40 px-3 py-2.5">
          <Avatar size="sm" className="size-9">
            <AvatarImage src={user?.image ?? undefined} alt={displayName} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {displayName}
            </p>
            {userEmail ? (
              <p className="truncate text-xs text-muted-foreground">
                {userEmail}
              </p>
            ) : null}
          </div>
        </div>

        <DropdownMenuSeparator />

        <SignOutButton
          className="w-full justify-start gap-2 rounded-xl px-3 py-2"
          triggerVariant="ghost"
        >
          <HugeiconsIcon
            icon={Logout01Icon}
            strokeWidth={2}
            aria-hidden="true"
          />
          <span>{m.auth_sign_out_label()}</span>
        </SignOutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
