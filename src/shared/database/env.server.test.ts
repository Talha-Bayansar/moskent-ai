import { describe, expect, it } from "vitest"

import { parseDatabaseEnv } from "./env.server"

describe("parseDatabaseEnv", () => {
  it("returns the database url when present", () => {
    expect(
      parseDatabaseEnv({
        DATABASE_URL:
          "postgresql://postgres:postgres@ep-example.eu-central-1.aws.neon.tech/moskent",
      })
    ).toEqual({
      databaseUrl:
        "postgresql://postgres:postgres@ep-example.eu-central-1.aws.neon.tech/moskent",
    })
  })

  it("throws when the database url is missing", () => {
    expect(() => parseDatabaseEnv({})).toThrowError(/DATABASE_URL/)
  })

  it("throws when the database url is not a valid url", () => {
    expect(() =>
      parseDatabaseEnv({
        DATABASE_URL: "not-a-url",
      })
    ).toThrowError(/DATABASE_URL/)
  })
})
