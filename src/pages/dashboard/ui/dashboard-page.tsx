import { LocaleSwitcher } from "@/shared/i18n/locale-switcher"
import { m } from "@/shared/i18n"

export function DashboardPage() {
  return (
    <main className="min-h-svh bg-muted/20 px-6 py-10">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 rounded-3xl border border-border/70 bg-background p-8 shadow-sm">
        <LocaleSwitcher />
        <span className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
          {m.dashboard_eyebrow()}
        </span>
        <h1 className="text-3xl font-semibold tracking-tight">
          {m.dashboard_title()}
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          {m.dashboard_description()}
        </p>
      </div>
    </main>
  )
}
