import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { betterAuth } from "better-auth"
import { organization } from "better-auth/plugins/organization"
import { tanstackStartCookies } from "better-auth/tanstack-start"

import {
  createDatabaseClient,
  getDatabaseClient,
} from "../../database/client.server"
import { getDatabaseEnv, type DatabaseEnv } from "../../database/env.server"

import { getAuthEnv, type AuthEnv } from "./env.server"
import { ac, roles } from "./permissions"
import * as schema from "./schema"

type CreateAuthOptions = {
  auth: AuthEnv
  database: DatabaseEnv
}

export function createAuth(options?: CreateAuthOptions) {
  const database = options
    ? createDatabaseClient(options.database)
    : getDatabaseClient()
  const authEnv = options?.auth ?? getAuthEnv()

  return betterAuth({
    appName: "Moskent AI",
    baseURL: authEnv.baseUrl,
    secret: authEnv.secret,
    database: drizzleAdapter(database, {
      provider: "pg",
      schema,
    }),
    emailAndPassword: {
      enabled: true,
    },
    plugins: [
      organization({
        ac,
        roles,
        dynamicAccessControl: {
          enabled: true,
        },
      }),
      tanstackStartCookies(),
    ],
  })
}

export const auth = createAuth({
  auth: getAuthEnv(),
  database: getDatabaseEnv(),
})
