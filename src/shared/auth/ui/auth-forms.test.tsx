// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

const { mockSignInEmail, mockSignUpEmail } = vi.hoisted(() => ({
  mockSignInEmail: vi.fn(),
  mockSignUpEmail: vi.fn(),
}))

vi.mock("@/shared/auth/auth-client", () => ({
  authClient: {
    signIn: {
      email: mockSignInEmail,
    },
    signUp: {
      email: mockSignUpEmail,
    },
  },
}))

import { SignInForm } from "./sign-in-form"
import { SignUpForm } from "./sign-up-form"

const signInCopy = {
  emailLabel: "Email",
  emailDescription: "Use the email address tied to your account.",
  passwordLabel: "Password",
  passwordDescription: "Enter the password for this workspace account.",
  submitLabel: "Sign in",
  submittingLabel: "Signing in...",
  genericError: "We could not complete this request. Please try again.",
}

const signUpCopy = {
  nameLabel: "Name",
  nameDescription: "Use the name that should appear inside the workspace.",
  emailLabel: "Email",
  emailDescription: "This will be your sign-in address.",
  passwordLabel: "Password",
  passwordDescription: "Use at least 8 characters.",
  confirmPasswordLabel: "Confirm password",
  confirmPasswordDescription: "Re-enter the password to avoid typos.",
  submitLabel: "Create account",
  submittingLabel: "Creating account...",
  genericError: "We could not complete this request. Please try again.",
}

describe("auth forms", () => {
  afterEach(() => {
    cleanup()
    mockSignInEmail.mockReset()
    mockSignUpEmail.mockReset()
  })

  it("shows sign-in validation errors and submits valid data", async () => {
    mockSignInEmail.mockResolvedValue({ data: {}, error: null })

    render(<SignInForm copy={signInCopy} redirectTo="/dashboard" />)

    fireEvent.blur(screen.getByLabelText("Email"))
    fireEvent.blur(screen.getByLabelText("Password"))

    expect(await screen.findByText("Email is required.")).toBeTruthy()
    expect(screen.getByText("Password is required.")).toBeTruthy()

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "user@example.com" },
    })
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "secret123" },
    })
    fireEvent.blur(screen.getByLabelText("Email"))
    fireEvent.blur(screen.getByLabelText("Password"))
    fireEvent.submit(screen.getByRole("button", { name: "Sign in" }).closest("form")!)

    await waitFor(() => {
      expect(mockSignInEmail).toHaveBeenCalledWith({
        email: "user@example.com",
        password: "secret123",
        callbackURL: "/dashboard",
      })
    })
  })

  it("shows sign-up validation errors and rejects password mismatch", async () => {
    mockSignUpEmail.mockResolvedValue({ data: {}, error: null })

    render(<SignUpForm copy={signUpCopy} redirectTo="/dashboard" />)

    fireEvent.blur(screen.getByLabelText("Name"))
    fireEvent.blur(screen.getByLabelText("Email"))
    fireEvent.blur(screen.getByLabelText("Password"))
    fireEvent.blur(screen.getByLabelText("Confirm password"))

    expect(await screen.findByText("Name must be at least 2 characters.")).toBeTruthy()
    expect(screen.getByText("Email is required.")).toBeTruthy()
    expect(screen.getByText("Password must be at least 8 characters.")).toBeTruthy()
    expect(screen.getByText("Confirm your password.")).toBeTruthy()

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Moskent" },
    })
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "user@example.com" },
    })
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "secret123" },
    })
    fireEvent.change(screen.getByLabelText("Confirm password"), {
      target: { value: "secret12" },
    })

    fireEvent.blur(screen.getByLabelText("Confirm password"))

    expect(await screen.findByText("Passwords must match.")).toBeTruthy()

    fireEvent.change(screen.getByLabelText("Confirm password"), {
      target: { value: "secret123" },
    })
    fireEvent.blur(screen.getByLabelText("Confirm password"))
    fireEvent.submit(screen.getByRole("button", { name: "Create account" }).closest("form")!)

    await waitFor(() => {
      expect(mockSignUpEmail).toHaveBeenCalledWith({
        email: "user@example.com",
        password: "secret123",
        name: "Moskent",
        callbackURL: "/dashboard",
      })
    })
  })
})
