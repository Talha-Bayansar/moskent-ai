import { createRouter as createTanStackRouter } from "@tanstack/react-router"
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query"

import { deLocalizeUrl, localizeUrl } from "@/paraglide/runtime.js"
import { routeTree } from "@/routeTree.gen"
import { createQueryClient } from "@/shared/query/query-client"

export function createAppRouter() {
  const queryClient = createQueryClient()
  const router = createTanStackRouter({
    routeTree,
    context: {
      queryClient,
    },
    rewrite: {
      input: ({ url }) => deLocalizeUrl(url),
      output: ({ url }) => localizeUrl(url),
    },
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
  })

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  })

  return router
}
