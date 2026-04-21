import { createAppRouter } from "@/app/create-router"

export function getRouter() {
  return createAppRouter()
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
