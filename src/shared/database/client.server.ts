import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

import { getDatabaseEnv, type DatabaseEnv } from "./env.server"
import * as schema from "./schema"

export function createDatabaseClient(env: DatabaseEnv = getDatabaseEnv()) {
  return drizzle(neon(env.databaseUrl), {
    schema,
  })
}

let databaseClient: ReturnType<typeof createDatabaseClient> | undefined

export function getDatabaseClient() {
  if (!databaseClient) {
    databaseClient = createDatabaseClient()
  }

  return databaseClient
}
