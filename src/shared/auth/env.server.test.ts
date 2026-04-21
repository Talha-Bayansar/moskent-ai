import { describe, expect, it } from "vitest"

import { parseAuthEnv } from "./env.server"

describe("parseAuthEnv", () => {
  it("returns the Better Auth secret and base url when present", () => {
    expect(
      parseAuthEnv({
        BETTER_AUTH_SECRET: "12345678901234567890123456789012",
        BETTER_AUTH_URL: "http://localhost:3000",
      })
    ).toEqual({
      baseUrl: "http://localhost:3000",
      secret: "12345678901234567890123456789012",
    })
  })

  it("throws when the Better Auth secret is missing", () => {
    expect(() =>
      parseAuthEnv({
        BETTER_AUTH_URL: "http://localhost:3000",
      })
    ).toThrowError(/BETTER_AUTH_SECRET/)
  })

  it("throws when the Better Auth url is missing", () => {
    expect(() =>
      parseAuthEnv({
        BETTER_AUTH_SECRET: "12345678901234567890123456789012",
      })
    ).toThrowError(/BETTER_AUTH_URL/)
  })
})
