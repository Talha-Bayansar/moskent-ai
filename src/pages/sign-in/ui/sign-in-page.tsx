import { Link } from "@tanstack/react-router"

import { m } from "@/shared/i18n"

export function SignInPage() {
  return (
    <main className="min-h-svh bg-background px-6 py-10">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <span className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
          {m.sign_in_eyebrow()}
        </span>
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">
            {m.sign_in_title()}
          </h1>
          <p className="max-w-xl text-base leading-7 text-muted-foreground">
            {m.sign_in_description()}
          </p>
        </div>
        <Link
          to="/"
          className="text-sm font-medium text-foreground transition-colors hover:text-primary"
        >
          {m.auth_back_home()}
        </Link>
      </div>
    </main>
  )
}
