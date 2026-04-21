import { describe, expect, it } from "vitest"

describe("createAuth", () => {
  it(
    "creates a Better Auth instance with a handler and server api",
    async () => {
      process.env.BETTER_AUTH_SECRET = "12345678901234567890123456789012"
      process.env.BETTER_AUTH_URL = "http://localhost:3000"
      process.env.DATABASE_URL =
        "postgresql://postgres:postgres@ep-example.eu-central-1.aws.neon.tech/moskent"

    const { createAuth } = await import("./auth.server")

    const auth = createAuth({
      auth: {
        baseUrl: "http://localhost:3000",
        secret: "12345678901234567890123456789012",
      },
      database: {
        databaseUrl:
          "postgresql://postgres:postgres@ep-example.eu-central-1.aws.neon.tech/moskent",
      },
    })

      expect(auth).toMatchObject({
        api: expect.any(Object),
        handler: expect.any(Function),
      })
    },
    10000
  )
})
