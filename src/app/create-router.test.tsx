import { describe, expect, it } from "vitest"

import { createAppRouter } from "./create-router"

describe("createAppRouter", () => {
  it("wires TanStack Query SSR integration into the router", () => {
    const router = createAppRouter()

    expect(router.options.Wrap).toBeTypeOf("function")
  })

  it("creates an isolated query client for each router instance", () => {
    const firstRouter = createAppRouter()
    const secondRouter = createAppRouter()

    expect(firstRouter.options.context.queryClient).not.toBe(
      secondRouter.options.context.queryClient
    )
  })
})
