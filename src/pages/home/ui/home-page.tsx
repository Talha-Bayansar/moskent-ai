import { Link } from "@tanstack/react-router"

import { LocaleSwitcher } from "@/shared/i18n/locale-switcher"
import { m } from "@/shared/i18n"

const quickLinks = [
  {
    label: () => m.home_dashboard_label(),
    to: "/dashboard",
  },
  {
    label: () => m.home_sign_in_label(),
    to: "/sign-in",
  },
] as const

export function HomePage() {
  return (
    <main className="min-h-svh bg-background px-4 py-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:px-6 sm:py-10">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 sm:gap-12">
        <section className="flex flex-col gap-5 sm:gap-6">
          <LocaleSwitcher />
          <div className="space-y-4">
            <h1 className="max-w-2xl text-3xl leading-tight font-semibold tracking-tight text-balance text-foreground sm:text-5xl">
              {m.home_title()}
            </h1>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
              {m.home_description()}
            </p>
          </div>
        </section>

        <nav
          aria-label="Primary"
          className="flex flex-col items-start gap-3 border-l border-border pl-4"
        >
          {quickLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-base font-medium text-foreground transition-colors hover:text-primary"
            >
              {link.label()}
            </Link>
          ))}
        </nav>
      </div>
    </main>
  )
}
