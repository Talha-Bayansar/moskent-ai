import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { TanStackDevtools } from "@tanstack/react-devtools"
import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import type { QueryClient } from "@tanstack/react-query"

import { NotFoundPage } from "@/pages/not-found/ui/not-found-page"
import { getLocale, m } from "@/shared/i18n"
import appCss from "@/styles.css?url"

type AppRouterContext = {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<AppRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: m.app_title(),
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  component: Outlet,
  notFoundComponent: NotFoundPage,
})

export function RootDocument({ children }: { children: ReactNode }) {
  const isTestEnvironment =
    typeof navigator !== "undefined" && navigator.userAgent.includes("jsdom")

  return (
    <html lang={getLocale()} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        {children}
        {isTestEnvironment ? null : <AppDevtools />}
        <Scripts />
      </body>
    </html>
  )
}

function AppDevtools() {
  const [canRenderDevtools, setCanRenderDevtools] = useState(false)

  useEffect(() => {
    if (!import.meta.env.DEV) {
      return
    }

    const mediaQuery = window.matchMedia("(min-width: 1024px)")
    const updateCanRender = () => setCanRenderDevtools(mediaQuery.matches)

    if (window.localStorage.getItem("moskent:devtools") !== "true") {
      return
    }

    updateCanRender()
    mediaQuery.addEventListener("change", updateCanRender)

    return () => mediaQuery.removeEventListener("change", updateCanRender)
  }, [])

  if (!canRenderDevtools) {
    return null
  }

  return (
    <TanStackDevtools
      config={{
        position: "bottom-right",
      }}
      plugins={[
        {
          name: "TanStack Router",
          render: <TanStackRouterDevtoolsPanel />,
        },
      ]}
    />
  )
}
