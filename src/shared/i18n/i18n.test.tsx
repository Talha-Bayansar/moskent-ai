// @vitest-environment jsdom

import { RouterProvider } from "@tanstack/react-router"
import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it } from "vitest"

import { createAppRouter } from "@/app/create-router"
import { setLocale } from "@/shared/i18n"

let activeRouter: ReturnType<typeof createAppRouter> | undefined

function toUrl(value: string | URL) {
  return value instanceof URL ? value : new URL(value)
}

async function renderRoute(pathname: string, locale: "en" | "nl" | "tr") {
  window.history.replaceState({}, "", pathname)
  await setLocale(locale, { reload: false })

  const router = createAppRouter()
  activeRouter = router
  await router.load()

  render(<RouterProvider router={router} />)

  return router
}

describe("i18n integration", () => {
  beforeEach(async () => {
    window.history.replaceState({}, "", "/")
    window.scrollTo = () => {}
    document.cookie = ""
    await setLocale("en", { reload: false })
  })

  afterEach(() => {
    activeRouter?.dispose?.()
    activeRouter = undefined
    cleanup()
  })

  it("rewrites localized input URLs and localizes output URLs", async () => {
    window.history.replaceState({}, "", "/nl/dashboard")
    const router = createAppRouter()
    const rewrite = router.options.rewrite

    if (!rewrite?.input || !rewrite.output) {
      throw new Error("Router rewrite hooks are required for i18n routing")
    }

    const rewrittenInput = rewrite.input({
      url: new URL("https://example.com/tr/dashboard"),
    })
    const rewrittenOutput = rewrite.output({
      url: new URL("https://example.com/dashboard"),
    })

    if (!rewrittenInput || !rewrittenOutput) {
      throw new Error("Router rewrite hooks must return a localized URL")
    }

    const inputUrl = toUrl(rewrittenInput)
    const outputUrl = toUrl(rewrittenOutput)

    expect(inputUrl.pathname).toBe("/dashboard")
    expect(outputUrl.pathname).toBe("/nl/dashboard")
  })

  it("preserves the current route when building language switcher links", async () => {
    await renderRoute("/dashboard", "en")

    expect(screen.getByRole("button", { name: "English" }).getAttribute("href")).toBe(
      "/dashboard"
    )
    expect(screen.getByRole("button", { name: "Dutch" }).getAttribute("href")).toBe(
      "/nl/dashboard"
    )
    expect(
      screen.getByRole("button", { name: "Turkish" }).getAttribute("href")
    ).toBe("/tr/dashboard")
  })

  it("renders the home page in Dutch", async () => {
    await renderRoute("/nl", "nl")

    expect(
      screen.getByRole("heading", {
        name: "De TanStack starter routeert nu via feature-sliced page-grenzen.",
      })
    ).toBeTruthy()
    expect(screen.getAllByRole("link", { name: "Route openen" }).length).toBe(2)
  })

  it("renders the dashboard page in Turkish", async () => {
    await renderRoute("/tr/dashboard", "tr")

    expect(
      screen.getByRole("heading", { name: "Gösterge paneli" })
    ).toBeTruthy()
  })

  it("renders the organization page in English", async () => {
    await renderRoute("/organizations/demo-org", "en")

    expect(
      screen.getByRole("heading", { name: "Organization: demo-org" })
    ).toBeTruthy()
  })
})
