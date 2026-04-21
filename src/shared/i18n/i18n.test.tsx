// @vitest-environment jsdom

import { RouterProvider } from "@tanstack/react-router"
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const mockUseSession = vi.fn()

vi.mock("@/shared/auth/auth-client", () => ({
  authClient: {
    useSession: mockUseSession,
  },
}))

import { createAppRouter } from "@/app/create-router"
import { setLocale } from "@/shared/i18n"

let activeRouter: ReturnType<typeof createAppRouter> | undefined

type MockSessionState = {
  data: null | {
    session: {
      id: string
    }
    user: {
      id: string
    }
  }
  isPending: boolean
}

function setMockSessionState(state: MockSessionState) {
  mockUseSession.mockReturnValue(state)
}

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
    setMockSessionState({
      data: {
        session: {
          id: "session-1",
        },
        user: {
          id: "user-1",
        },
      },
      isPending: false,
    })
    await setLocale("en", { reload: false })
  })

  afterEach(() => {
    ;(activeRouter as { dispose?: () => void } | undefined)?.dispose?.()
    activeRouter = undefined
    mockUseSession.mockReset()
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
        name: "Moskent AI voor organisaties.",
      })
    ).toBeTruthy()
    expect(screen.getByRole("link", { name: "Dashboard" }).getAttribute("href")).toBe(
      "/nl/dashboard"
    )
    expect(screen.getByRole("link", { name: "Inloggen" }).getAttribute("href")).toBe(
      "/nl/sign-in"
    )
    expect(screen.getByRole("link", { name: "Uitloggen" }).getAttribute("href")).toBe(
      "/nl/sign-out"
    )
    expect(
      screen.queryByRole("link", { name: "Organisatiedetail" })
    ).toBeNull()
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

  it("renders the sign-in page in Turkish", async () => {
    await renderRoute("/tr/sign-in", "tr")

    expect(screen.getByRole("heading", { name: "Giriş yap" })).toBeTruthy()
  })

  it("renders the sign-out page in English", async () => {
    await renderRoute("/sign-out", "en")

    expect(screen.getByRole("heading", { name: "Sign out" })).toBeTruthy()
  })

  it("shows an auth-check spinner while a protected route session is pending", async () => {
    setMockSessionState({
      data: null,
      isPending: true,
    })

    await renderRoute("/tr/dashboard", "tr")

    expect(
      screen.getByRole("heading", { name: "Oturumunuz kontrol ediliyor" })
    ).toBeTruthy()
    expect(screen.getByRole("status", { name: "Loading" })).toBeTruthy()
  })

  it("redirects unauthenticated dashboard visits to sign-in with a localized return URL", async () => {
    setMockSessionState({
      data: null,
      isPending: false,
    })

    await renderRoute("/nl/dashboard", "nl")

    await waitFor(() => {
      expect(window.location.pathname).toBe("/nl/sign-in")
    })

    expect(screen.getByRole("heading", { name: "Inloggen" })).toBeTruthy()
    expect(
      new URLSearchParams(window.location.search).get("redirectTo")
    ).toBe("/nl/dashboard")
  })

  it("redirects unauthenticated organization visits to sign-in with the original path", async () => {
    setMockSessionState({
      data: null,
      isPending: false,
    })

    await renderRoute("/organizations/demo-org", "en")

    await waitFor(() => {
      expect(window.location.pathname).toBe("/sign-in")
    })

    expect(screen.getByRole("heading", { name: "Sign in" })).toBeTruthy()
    expect(
      new URLSearchParams(window.location.search).get("redirectTo")
    ).toBe("/organizations/demo-org")
  })

  it("keeps public routes accessible without a session", async () => {
    setMockSessionState({
      data: null,
      isPending: false,
    })

    await renderRoute("/", "en")

    expect(
      screen.getByRole("heading", { name: "Moskent AI for organizations." })
    ).toBeTruthy()
  })
})
