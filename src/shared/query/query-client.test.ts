import { describe, expect, it } from "vitest"

import { createQueryClient } from "./query-client"

describe("createQueryClient", () => {
  it("creates a query client with SSR-oriented defaults", () => {
    const queryClient = createQueryClient()
    const queryDefaults = queryClient.getDefaultOptions().queries

    expect(queryClient).toBeTypeOf("object")
    expect(queryDefaults?.staleTime).toBe(30_000)
    expect(queryDefaults?.retry).toBe(1)
  })
})
