import { LocaleSwitcher } from "@/shared/i18n/locale-switcher"
import { m } from "@/shared/i18n"

type OrganizationDetailPageProps = {
  organizationId: string
}

export function OrganizationDetailPage({
  organizationId,
}: OrganizationDetailPageProps) {
  return (
    <main className="min-h-svh bg-muted/20 px-6 py-10">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 rounded-3xl border border-border/70 bg-background p-8 shadow-sm">
        <LocaleSwitcher />
        <span className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
          {m.organization_eyebrow()}
        </span>
        <h1 className="text-3xl font-semibold tracking-tight">
          {m.organization_title({ organizationId })}
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          {m.organization_description()}
        </p>
      </div>
    </main>
  )
}
