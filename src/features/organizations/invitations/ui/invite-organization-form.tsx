"use client"

import { useState } from "react"
import { useForm } from "@tanstack/react-form"
import { HugeiconsIcon } from "@hugeicons/react"
import { MailAdd01Icon } from "@hugeicons/core-free-icons"
import { Link } from "@tanstack/react-router"

import {
  inviteOrganizationMemberSchema,
  normalizeOrganizationInvitationEmail,
} from "../model/schema"
import {
  useInviteOrganizationMemberMutation,
} from "../model/mutations"

import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/shared/ui/field"
import { Input } from "@/shared/ui/input"
import { Spinner } from "@/shared/ui/spinner"

export type InviteOrganizationFormCopy = {
  cardTitle: string
  cardDescription: string
  emailLabel: string
  emailDescription: string
  submitLabel: string
  submittingLabel: string
  successTitle: string
  successDescription: string
  successBody: string
  errorTitle: string
  genericError: string
  backMembersLabel: string
  inviteAnotherLabel: string
}

type InviteOrganizationFormProps = {
  copy: InviteOrganizationFormCopy
  organizationId?: string | null
  className?: string
}

export function InviteOrganizationForm({
  copy,
  organizationId,
  className,
}: InviteOrganizationFormProps) {
  const [isInvited, setIsInvited] = useState(false)

  const inviteOrganizationMemberMutation = useInviteOrganizationMemberMutation()

  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: inviteOrganizationMemberSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await inviteOrganizationMemberMutation.mutateAsync({
          email: normalizeOrganizationInvitationEmail(value.email),
          organizationId,
        })

        form.reset()
        setIsInvited(true)
      } catch {
        // The mutation error is surfaced inline.
      }
    },
  })

  if (isInvited) {
    return (
      <Card className={cn("bg-card/80", className)}>
        <CardHeader>
          <CardTitle>{copy.successTitle}</CardTitle>
          <CardDescription>{copy.successDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background px-4 py-3">
            <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <HugeiconsIcon icon={MailAdd01Icon} strokeWidth={2} />
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              {copy.successBody}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => {
              inviteOrganizationMemberMutation.reset()
              setIsInvited(false)
              form.reset()
            }}
          >
            {copy.inviteAnotherLabel}
          </Button>
          <Button className="w-full sm:w-auto" render={<Link to="/dashboard/members" />}>
            {copy.backMembersLabel}
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className={cn("bg-card/80", className)}>
      <CardHeader>
        <CardTitle>{copy.cardTitle}</CardTitle>
        <CardDescription>{copy.cardDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            void form.handleSubmit()
          }}
          className="flex flex-col gap-6"
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
                      inputMode="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => {
                        field.handleChange(event.target.value)

                        if (inviteOrganizationMemberMutation.isError) {
                          inviteOrganizationMemberMutation.reset()
                        }
                      }}
                      aria-invalid={showError}
                    />
                    <FieldDescription>{copy.emailDescription}</FieldDescription>
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )
              }}
            />
          </FieldGroup>

          {inviteOrganizationMemberMutation.error ? (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              <p className="font-medium">{copy.errorTitle}</p>
              <p className="mt-1">
                {inviteOrganizationMemberMutation.error.message ||
                  copy.genericError}
              </p>
            </div>
          ) : null}

          <form.Subscribe
            selector={(state) => ({
              canSubmit: state.canSubmit,
              isSubmitting: state.isSubmitting,
            })}
          >
            {({ canSubmit, isSubmitting }) => {
              const isBusy = isSubmitting || inviteOrganizationMemberMutation.isPending

              return (
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!canSubmit || isBusy}
                >
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
      </CardContent>
    </Card>
  )
}
