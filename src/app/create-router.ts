import { createRouter as createTanStackRouter } from "@tanstack/react-router"

import { routeTree } from "@/routeTree.gen"

export function createAppRouter() {
  return createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
  })
}
