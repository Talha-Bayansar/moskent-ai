"use client"

import { useForm } from "@tanstack/react-form"
import { z } from "zod"

import { authClient } from "@/shared/auth/auth-client"
import { m } from "@/shared/i18n"
import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/shared/ui/field"
import { Input } from "@/shared/ui/input"

const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, m.validation_email_required())
    .email(m.validation_email_invalid()),
  password: z.string().min(1, m.validation_password_required()),
})

export type SignInFormCopy = {
  emailLabel: string
  emailDescription: string
  passwordLabel: string
  passwordDescription: string
  submitLabel: string
  submittingLabel: string
  genericError: string
}

type SignInFormProps = {
  copy: SignInFormCopy
  redirectTo?: string
  className?: string
}

export function SignInForm({
  copy,
  redirectTo = "/dashboard",
  className,
}: SignInFormProps) {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: signInSchema,
    },
    onSubmit: async ({ value }) => {
      const { error } = await authClient.signIn.email({
        email: value.email.trim(),
        password: value.password,
        callbackURL: redirectTo,
      })

      if (error) {
        console.error(error.message ?? copy.genericError)
      }
    },
  })

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        void form.handleSubmit()
      }}
      className={cn("space-y-6", className)}
    >
      <FieldGroup className="gap-4">
        <form.Field
          name="email"
          children={(field) => {
            const showError =
              field.state.meta.errors.length > 0 &&
              (field.state.meta.isTouched || form.state.isSubmitted)

            return (
              <Field data-invalid={showError}>
                <FieldLabel htmlFor={field.name}>{copy.emailLabel}</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  autoComplete="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={showError}
                />
                <FieldDescription>{copy.emailDescription}</FieldDescription>
                {showError ? (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors[0]?.message}
                  </p>
                ) : null}
              </Field>
            )
          }}
        />

        <form.Field
          name="password"
          children={(field) => {
            const showError =
              field.state.meta.errors.length > 0 &&
              (field.state.meta.isTouched || form.state.isSubmitted)

            return (
              <Field data-invalid={showError}>
                <FieldLabel htmlFor={field.name}>
                  {copy.passwordLabel}
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  autoComplete="current-password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={showError}
                />
                <FieldDescription>{copy.passwordDescription}</FieldDescription>
                {showError ? (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors[0]?.message}
                  </p>
                ) : null}
              </Field>
            )
          }}
        />
      </FieldGroup>

      <form.Subscribe
        selector={(state) => ({
          canSubmit: state.canSubmit,
          isSubmitting: state.isSubmitting,
        })}
      >
        {({ canSubmit, isSubmitting }) => (
          <Button type="submit" className="w-full" disabled={!canSubmit}>
            {isSubmitting ? copy.submittingLabel : copy.submitLabel}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
