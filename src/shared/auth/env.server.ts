import { z } from "zod"

const authEnvSchema = z.object({
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.string().url(),
})

export type AuthEnv = {
  baseUrl: string
  secret: string
}

export function parseAuthEnv(
  input: Record<string, string | undefined>
): AuthEnv {
  const parsed = authEnvSchema.safeParse(input)

  if (!parsed.success) {
    throw new Error(
      `Invalid auth environment: ${parsed.error.issues
        .map((issue) => issue.path.join("."))
        .join(", ")}`
    )
  }

  return {
    baseUrl: parsed.data.BETTER_AUTH_URL,
    secret: parsed.data.BETTER_AUTH_SECRET,
  }
}

export function getAuthEnv(): AuthEnv {
  return parseAuthEnv(process.env)
}
