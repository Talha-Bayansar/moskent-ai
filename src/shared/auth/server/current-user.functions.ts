import { createServerFn } from "@tanstack/react-start"
import { getRequestHeaders } from "@tanstack/react-start/server"
import { findCurrentUser } from "./current-user.server"

export const getCurrentUser = createServerFn({ method: "GET" }).handler(
  async () => {
    const headers = getRequestHeaders()
    const user = await findCurrentUser(headers)

    return user
  }
)
