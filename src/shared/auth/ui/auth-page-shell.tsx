"use client"

import { Link } from "@tanstack/react-router"
import type { ReactNode } from "react"

import { LocaleSwitcher } from "@/shared/i18n/locale-switcher"

type AuthPageShellProps = {
  eyebrow?: string
  title: string
  description: string
  footer?: ReactNode
  children: ReactNode
}

export function AuthPageShell({
  eyebrow,
  title,
  description,
  footer,
  children,
}: AuthPageShellProps) {
  return (
    <main className="relative min-h-svh overflow-hidden bg-background px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:px-8 sm:py-4 lg:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.1),_transparent_28%)] sm:bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.16),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(15,23,42,0.06),_transparent_28%)] dark:bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.1),_transparent_28%)] sm:dark:bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.12),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.08),_transparent_28%)]" />
      <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:80px_80px] opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent_88%)] sm:block" />
      <div className="relative mx-auto flex min-h-[calc(100svh-1.5rem-env(safe-area-inset-bottom))] w-full max-w-5xl flex-col sm:min-h-[calc(100svh-2rem)]">
        <div className="flex items-center justify-between gap-3 py-1 sm:gap-4 sm:py-2">
          <Link
            to="/"
            className="min-w-0 truncate text-sm font-medium tracking-[0.12em] text-foreground/70 transition-colors hover:text-foreground sm:tracking-[0.18em]"
          >
            Moskent AI
          </Link>
          <LocaleSwitcher />
        </div>

        <div className="flex flex-1 items-center justify-center py-6 sm:py-12">
          <div className="w-full max-w-xl space-y-6 sm:space-y-8">
            <div className="space-y-3 text-center sm:space-y-4">
              {eyebrow ? (
                <span className="inline-flex items-center rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground shadow-sm sm:tracking-[0.22em]">
                  {eyebrow}
                </span>
              ) : null}
              <div className="space-y-3 sm:space-y-4">
                <h1 className="text-3xl leading-tight font-semibold tracking-tight text-balance text-foreground sm:text-5xl">
                  {title}
                </h1>
                <p className="mx-auto max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">
                  {description}
                </p>
              </div>
            </div>

            <div className="space-y-6 sm:space-y-8">{children}</div>

            {footer}
          </div>
        </div>
      </div>
    </main>
  )
}
