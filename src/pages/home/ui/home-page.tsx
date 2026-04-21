import { Link } from "@tanstack/react-router"

import { LocaleSwitcher } from "@/shared/i18n/locale-switcher"
import { m } from "@/shared/i18n"
import { Button } from "@/shared/ui/button"

const quickLinks = [
  {
    description: () => m.home_dashboard_description(),
    label: () => m.home_dashboard_label(),
    params: undefined,
    to: "/dashboard",
  },
  {
    description: () => m.home_organization_description(),
    label: () => m.home_organization_label(),
    params: {
      organizationId: "demo-org",
    },
    to: "/organizations/$organizationId",
  },
] as const

export function HomePage() {
  return (
    <main className="min-h-svh bg-linear-to-b from-background via-background to-muted/40 px-6 py-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <section className="grid gap-4">
          <LocaleSwitcher />
          <span className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
            {m.home_eyebrow()}
          </span>
          <div className="grid gap-3">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {m.home_title()}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              {m.home_description()}
            </p>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {quickLinks.map((link) => (
            <article
              key={link.to}
              className="rounded-3xl border border-border/70 bg-card/80 p-6 shadow-sm backdrop-blur"
            >
              <div className="flex h-full flex-col gap-4">
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-card-foreground">
                    {link.label()}
                  </h2>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {link.description()}
                  </p>
                </div>

                <div className="mt-auto">
                  {link.params ? (
                    <Button
                      render={<Link to={link.to} params={link.params} />}
                    >
                      {m.home_open_route()}
                    </Button>
                  ) : (
                    <Button render={<Link to={link.to} />}>
                      {m.home_open_route()}
                    </Button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  )
}
