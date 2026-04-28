"use client"

import { useRef } from "react"
import { useForm } from "@tanstack/react-form"

import {
  createOrganizationSchema,
  deriveOrganizationSlug,
  normalizeOrganizationSlug,
} from "../model/schema"
import { useCreateOrganizationMutation } from "../model/mutation"

import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert"
import { Button } from "@/shared/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/shared/ui/field"
import { Input } from "@/shared/ui/input"
import { Spinner } from "@/shared/ui/spinner"
import { cn } from "@/shared/lib/utils"

export type CreateOrganizationFormCopy = {
  nameLabel: string
  nameDescription: string
  slugLabel: string
  slugDescription: string
  submitLabel: string
  submittingLabel: string
  genericError: string
  errorTitle: string
}

type CreateOrganizationFormProps = {
  copy: CreateOrganizationFormCopy
  onCreated?: () => void
  className?: string
}

export function CreateOrganizationForm({
  copy,
  onCreated,
  className,
}: CreateOrganizationFormProps) {
  const manualSlugRef = useRef(false)

  const createOrganizationMutation = useCreateOrganizationMutation({
    onSuccess: () => {
      onCreated?.()
    },
  })

  const form = useForm({
    defaultValues: {
      name: "",
      slug: "",
    },
    validators: {
      onSubmit: createOrganizationSchema,
    },
    onSubmit: async ({ value }) => {
      const payload = {
        name: value.name.trim(),
        slug: normalizeOrganizationSlug(
          value.slug || deriveOrganizationSlug(value.name)
        ),
      }

      try {
        await createOrganizationMutation.mutateAsync(payload)
      } catch {
        // The mutation error is surfaced in the UI.
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
      className={cn("flex flex-col gap-6", className)}
    >
      <FieldGroup className="gap-4">
        <form.Field
          name="name"
          children={(field) => {
            const showError =
              field.state.meta.errors.length > 0 &&
              (field.state.meta.isTouched || form.state.isSubmitted)

            return (
              <Field data-invalid={showError}>
                <FieldLabel htmlFor={field.name}>{copy.nameLabel}</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  autoComplete="off"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => {
                    const nextName = event.target.value

                    field.handleChange(nextName)

                    if (!manualSlugRef.current) {
                      form.setFieldValue(
                        "slug",
                        deriveOrganizationSlug(nextName)
                      )
                    }

                    if (createOrganizationMutation.isError) {
                      createOrganizationMutation.reset()
                    }
                  }}
                  aria-invalid={showError}
                />
                <FieldDescription>{copy.nameDescription}</FieldDescription>
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )
          }}
        />

        <form.Field
          name="slug"
          children={(field) => {
            const showError =
              field.state.meta.errors.length > 0 &&
              (field.state.meta.isTouched || form.state.isSubmitted)

            return (
              <Field data-invalid={showError}>
                <FieldLabel htmlFor={field.name}>{copy.slugLabel}</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  autoComplete="off"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => {
                    manualSlugRef.current = true
                    field.handleChange(event.target.value)

                    if (createOrganizationMutation.isError) {
                      createOrganizationMutation.reset()
                    }
                  }}
                  aria-invalid={showError}
                />
                <FieldDescription>{copy.slugDescription}</FieldDescription>
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )
          }}
        />
      </FieldGroup>

      {createOrganizationMutation.error ? (
        <Alert variant="destructive">
          <AlertTitle>{copy.errorTitle}</AlertTitle>
          <AlertDescription>
            {createOrganizationMutation.error.message || copy.genericError}
          </AlertDescription>
        </Alert>
      ) : null}

      <form.Subscribe
        selector={(state) => ({
          canSubmit: state.canSubmit,
          isSubmitting: state.isSubmitting,
        })}
      >
        {({ canSubmit, isSubmitting }) => {
          const isBusy = isSubmitting || createOrganizationMutation.isPending

          return (
            <Button type="submit" className="w-full" disabled={!canSubmit || isBusy}>
              {isBusy ? (
                <>
                  <Spinner data-icon="inline-start" />
                  {copy.submittingLabel}
                </>
              ) : (
                copy.submitLabel
              )}
            </Button>
          )
        }}
      </form.Subscribe>
    </form>
  )
}
