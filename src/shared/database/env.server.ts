import { z } from "zod"

const databaseEnvSchema = z.object({
  DATABASE_URL: z.string().url(),
})

export type DatabaseEnv = {
  databaseUrl: string
}

export function parseDatabaseEnv(
  input: Record<string, string | undefined>
): DatabaseEnv {
  const parsed = databaseEnvSchema.safeParse(input)

  if (!parsed.success) {
    throw new Error(
      `Invalid database environment: ${parsed.error.issues
        .map((issue) => issue.path.join("."))
        .join(", ")}`
    )
  }

  return {
    databaseUrl: parsed.data.DATABASE_URL,
  }
}

export function getDatabaseEnv(): DatabaseEnv {
  return parseDatabaseEnv(process.env)
}
