import { createAuthClient } from "better-auth/react"
import { organizationClient } from "better-auth/client/plugins"

import { ac, roles } from "./permissions"

export function createClientAuth(baseURL?: string) {
  return createAuthClient(
    {
      ...(baseURL
        ? {
            baseURL,
          }
        : {}),
      plugins: [
        organizationClient({
          ac,
          roles,
          dynamicAccessControl: {
            enabled: true,
          },
        }),
      ],
    }
  )
}

export const authClient = createClientAuth()
