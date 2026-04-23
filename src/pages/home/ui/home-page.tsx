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
    <main className="min-h-svh bg-background px-6 py-10">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-12">
        <section className="flex flex-col gap-6">
          <LocaleSwitcher />
          <span className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
            {m.home_eyebrow()}
          </span>
          <div className="space-y-4">
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {m.home_title()}
            </h1>
            <p className="max-w-xl text-base leading-7 text-muted-foreground">
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
