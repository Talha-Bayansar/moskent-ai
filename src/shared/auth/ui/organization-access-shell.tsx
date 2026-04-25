"use client"

import { Link } from "@tanstack/react-router"
import type { ReactNode } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Home01Icon } from "@hugeicons/core-free-icons"

import { ProfileMenu } from "./profile-menu"
import { m } from "@/shared/i18n"
import { cn } from "@/shared/lib/utils"

type OrganizationAccessShellProps = {
  children: ReactNode
  className?: string
}

export function OrganizationAccessShell({
  children,
  className,
}: OrganizationAccessShellProps) {
  return (
    <main className="relative min-h-svh overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.12),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(15,23,42,0.06),_transparent_32%)] dark:bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.08),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.07),_transparent_28%)]" />
      <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:84px_84px] opacity-45 [mask-image:linear-gradient(to_bottom,black,transparent_88%)] sm:block" />

      <div className="relative mx-auto flex min-h-svh w-full max-w-6xl flex-col px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-[calc(1rem+env(safe-area-inset-top))] sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-3 rounded-3xl border border-border/70 bg-background/88 px-4 py-3 shadow-sm backdrop-blur">
          <Link
            to="/organizations"
            className="flex min-w-0 flex-1 items-center gap-2.5 rounded-full px-1 py-1 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
          >
            <span className="flex size-8 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-xs">
              <HugeiconsIcon icon={Home01Icon} strokeWidth={2} />
            </span>
            <span className="truncate">{m.app_title()}</span>
          </Link>

          <ProfileMenu
            showDisplayName={false}
            className="size-10 shrink-0 border-border bg-background text-foreground hover:bg-muted"
          />
        </header>

        <div
          className={cn(
            "flex flex-1 flex-col gap-6 py-6 sm:gap-8 sm:py-8 lg:py-10",
            className
          )}
        >
          {children}
        </div>
      </div>
    </main>
  )
}
