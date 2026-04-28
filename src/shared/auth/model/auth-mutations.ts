import { useMutation, useQueryClient } from "@tanstack/react-query"

import { refreshSignedInAuthState } from "./auth-cache"
import { authClient } from "./auth-client"

import { m } from "@/shared/i18n"

type AuthCredentials = {
  redirectTo?: string
}

type SignInInput = AuthCredentials & {
  email: string
  password: string
}

type SignUpInput = AuthCredentials & {
  name: string
  email: string
  password: string
}

export type AuthTransitionResult = Awaited<
  ReturnType<typeof refreshSignedInAuthState>
>

export function useSignInMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ email, password }: SignInInput) => {
      const { error } = await authClient.signIn.email({
        email,
        password,
      })

      if (error) {
        throw new Error(error.message ?? m.auth_generic_error())
      }

      return refreshSignedInAuthState(queryClient)
    },
  })
}

export function useSignUpMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ name, email, password }: SignUpInput) => {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
      })

      if (error) {
        throw new Error(error.message ?? m.auth_generic_error())
      }

      return refreshSignedInAuthState(queryClient)
    },
  })
}

export function useSignOutMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { error } = await authClient.signOut()

      if (error) {
        throw new Error(error.message ?? m.auth_sign_out_error())
      }

      return refreshSignedInAuthState(queryClient)
    },
  })
}
