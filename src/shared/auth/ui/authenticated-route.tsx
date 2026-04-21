import { Navigate, useLocation } from "@tanstack/react-router"
import type { ReactNode } from "react"

import { authClient } from "@/shared/auth/auth-client"
import { m } from "@/shared/i18n"
import { Spinner } from "@/shared/ui/spinner"

type AuthenticatedRouteProps = {
  children: ReactNode
}

export function AuthenticatedRoute({ children }: AuthenticatedRouteProps) {
  const location = useLocation()
  const sessionState = authClient.useSession()
  const session = sessionState.data
  const isPending = sessionState.isPending
  const redirectTo =
    typeof window === "undefined"
      ? `${location.pathname}${location.searchStr}${location.hash}`
      : `${window.location.pathname}${window.location.search}${window.location.hash}`

  if (isPending) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-muted/20 px-6 py-10">
        <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-3xl border border-border/70 bg-background p-8 text-center shadow-sm">
          <Spinner className="size-6" />
          <div className="space-y-2">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              {m.auth_checking_title()}
            </h1>
            <p className="text-sm leading-6 text-muted-foreground">
              {m.auth_checking_description()}
            </p>
          </div>
        </div>
      </main>
    )
  }

  if (!session) {
    return (
      <Navigate
        to="/sign-in"
        search={{
          redirectTo,
        }}
        replace
      />
    )
  }

  return children
}
