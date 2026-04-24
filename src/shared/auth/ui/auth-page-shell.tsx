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
    <main className="relative min-h-svh overflow-hidden bg-background px-6 py-4 sm:px-8 lg:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.16),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(15,23,42,0.06),_transparent_28%)] dark:bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.12),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.08),_transparent_28%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:80px_80px] opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent_88%)]" />
      <div className="relative mx-auto flex min-h-[calc(100svh-2rem)] w-full max-w-5xl flex-col">
        <div className="flex items-center justify-between gap-4 py-2">
          <Link
            to="/"
            className="text-sm font-medium tracking-[0.18em] text-foreground/70 transition-colors hover:text-foreground"
          >
            Moskent AI
          </Link>
          <LocaleSwitcher />
        </div>

        <div className="flex flex-1 items-center justify-center py-10 sm:py-12">
          <div className="w-full max-w-xl space-y-8">
            <div className="space-y-3 text-center">
              {eyebrow ? (
                <span className="inline-flex items-center rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground shadow-sm">
                  {eyebrow}
                </span>
              ) : null}
              <div className="space-y-4">
                <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                  {title}
                </h1>
                <p className="mx-auto max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">
                  {description}
                </p>
              </div>
            </div>

            <div className="space-y-8">{children}</div>

            {footer}
          </div>
        </div>
      </div>
    </main>
  )
}
