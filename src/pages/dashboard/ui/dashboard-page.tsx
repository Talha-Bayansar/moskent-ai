import { Link } from "@tanstack/react-router"

import { m } from "@/shared/i18n"
import { cn } from "@/shared/lib/utils"
import { buttonVariants } from "@/shared/ui/button"

export function DashboardPage() {
  return (
    <section className="flex flex-col gap-8">
      <div className="flex max-w-3xl flex-col gap-3">
        <span className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
          {m.dashboard_eyebrow()}
        </span>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          {m.dashboard_title()}
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">
          {m.dashboard_description()}
        </p>
      </div>

      <div className="flex flex-col gap-6 border-t border-border pt-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-sm font-medium text-foreground">
            {m.organization_create_title()}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {m.organization_create_description()}
          </p>
        </div>
        <Link
          to="/organizations/new"
          className={cn(buttonVariants({ variant: "default" }), "w-fit")}
        >
          {m.organization_create_submit()}
        </Link>
      </div>
    </section>
  )
}
