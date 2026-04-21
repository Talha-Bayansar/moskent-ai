import { describe, expect, it } from "vitest"

import { createDatabaseClient } from "./client.server"

describe("createDatabaseClient", () => {
  it("creates a drizzle client from the database url", () => {
    const database = createDatabaseClient({
      databaseUrl:
        "postgresql://postgres:postgres@ep-example.eu-central-1.aws.neon.tech/moskent",
    })

    expect(database).toBeTypeOf("object")
  })
})
