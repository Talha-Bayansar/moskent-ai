import { createRouter as createTanStackRouter } from "@tanstack/react-router"

import { deLocalizeUrl, localizeUrl } from "@/paraglide/runtime.js"
import { routeTree } from "@/routeTree.gen"

export function createAppRouter() {
  return createTanStackRouter({
    routeTree,
    rewrite: {
      input: ({ url }) => deLocalizeUrl(url),
      output: ({ url }) => localizeUrl(url),
    },
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
  })
}
