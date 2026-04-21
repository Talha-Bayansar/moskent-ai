import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { paraglideMiddleware } from "@/paraglide/server.js"
import { getLocale } from "@/shared/i18n"

describe("i18n server integration", () => {
  it("resolves locale in middleware and renders the current html lang", async () => {
    const response = await paraglideMiddleware(
      new Request("https://example.com/tr/dashboard", {
        headers: {
          "sec-fetch-dest": "document",
        },
      }),
      () =>
        new Response(
          renderToStaticMarkup(<html lang={getLocale()} />),
          {
            headers: {
              "content-type": "text/html",
            },
          }
        )
    )

    expect(response.status).toBe(200)
    expect(await response.text()).toContain('<html lang="tr">')
  })

  it("falls back to the base locale when no other locale source is present", async () => {
    const response = await paraglideMiddleware(
      new Request("https://example.com/dashboard"),
      () => new Response(getLocale())
    )

    expect(await response.text()).toBe("en")
  })
})
