type OrganizationDetailPageProps = {
  organizationId: string
}

export function OrganizationDetailPage({
  organizationId,
}: OrganizationDetailPageProps) {
  return (
    <main className="min-h-svh bg-muted/20 px-6 py-10">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 rounded-3xl border border-border/70 bg-background p-8 shadow-sm">
        <span className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
          routes/organizations/$organizationId/index.tsx
        </span>
        <h1 className="text-3xl font-semibold tracking-tight">
          Organization: {organizationId}
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          This dynamic folder route demonstrates TanStack Router path params
          while keeping domain persistence decisions out of the first database
          setup pass.
        </p>
      </div>
    </main>
  )
}
