export function DashboardPage() {
  return (
    <main className="min-h-svh bg-muted/20 px-6 py-10">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 rounded-3xl border border-border/70 bg-background p-8 shadow-sm">
        <span className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
          routes/dashboard/index.tsx
        </span>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          This page exists mainly to prove the folder-per-route TanStack Router
          convention. The route file is a thin adapter and the page UI lives in
          the pages layer.
        </p>
      </div>
    </main>
  )
}
