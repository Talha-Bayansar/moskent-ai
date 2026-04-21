import { describe, expect, it } from "vitest"

import { createClientAuth } from "./auth-client"

describe("createClientAuth", () => {
  it("creates a Better Auth client with organization helpers", () => {
    const authClient = createClientAuth("http://localhost:3000")

    expect(authClient.organization).toBeDefined()
  })
})
