import { createAuthClient } from "better-auth/react"

export function createClientAuth(baseURL?: string) {
  return createAuthClient(
    baseURL
      ? {
          baseURL,
        }
      : {}
  )
}

export const authClient = createClientAuth()
