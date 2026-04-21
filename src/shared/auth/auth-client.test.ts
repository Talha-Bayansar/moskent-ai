import { describe, expect, it } from "vitest"

import { createClientAuth } from "./auth-client"

describe("createClientAuth", () => {
  it("creates a Better Auth client that targets the mounted auth route", () => {
    expect(() => createClientAuth("http://localhost:3000")).not.toThrow()
  })
})
