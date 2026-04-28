"use client"

import { useForm } from "@tanstack/react-form"
import { HugeiconsIcon } from "@hugeicons/react"
import { UserEdit01Icon } from "@hugeicons/core-free-icons"

import type { OrganizationMemberSummary } from "../model/types"
import type { OrganizationRoleSummary } from "@/features/organizations/roles/model/types"
import { useUpdateOrganizationMemberMutation } from "../model/mutations"
import { updateMemberRoleSchema } from "../model/schema"
import {
  formatMemberRoleLabel,
  getMemberAvatarFallback,
  getMemberAvatarSource,
  getMemberDisplayName,
  getMemberEmail,
  normalizeMemberRoleValue,
} from "../lib/member-labels"
import { cn } from "@/shared/lib/utils"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/shared/ui/field"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/ui/avatar"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"
import { Spinner } from "@/shared/ui/spinner"

type UpdateMemberFormCopy = {
  cardTitle: string
  cardDescription: string
  roleLabel: string
  roleDescription: string
  submitLabel: string
  submittingLabel: string
  errorTitle: string
  genericError: string
}

type UpdateMemberFormProps = {
  member: OrganizationMemberSummary
  organizationId: string | null
  roles: Array<OrganizationRoleSummary>
  copy: UpdateMemberFormCopy
  className?: string
  onSuccess?: () => void
}

export function UpdateMemberForm({
  member,
  organizationId,
  roles,
  copy,
  className,
  onSuccess,
}: UpdateMemberFormProps) {
  const updateMemberMutation = useUpdateOrganizationMemberMutation({
    onSuccess: () => {
      onSuccess?.()
    },
  })

  const defaultRole =
    normalizeMemberRoleValue(member.role) || roles[0]?.role?.trim() || ""

  const form = useForm({
    defaultValues: {
      role: defaultRole,
    },
    validators: {
      onSubmit: updateMemberRoleSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await updateMemberMutation.mutateAsync({
          organizationId,
          memberId: member.id,
          role: value.role,
        })
      } catch {
        // The mutation error is surfaced inline.
      }
    },
  })

  const displayName = getMemberDisplayName(member)
  const email = getMemberEmail(member)
  const avatarSource = getMemberAvatarSource(member)
  const avatarFallback = getMemberAvatarFallback(member)
  const currentRole = formatMemberRoleLabel(member.role)
  const isBusy = form.state.isSubmitting || updateMemberMutation.isPending
  const hasRoles = roles.length > 0

  return (
    <Card className={cn("bg-card/80", className)}>
      <CardHeader>
        <div className="flex size-11 items-center justify-center rounded-2xl border border-border bg-background text-foreground shadow-xs">
          <HugeiconsIcon icon={UserEdit01Icon} strokeWidth={2} />
        </div>
        <CardTitle>{copy.cardTitle}</CardTitle>
        <CardDescription>{copy.cardDescription}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-border/70 bg-background px-4 py-3">
          <Avatar size="sm" className="size-10 shrink-0">
            <AvatarImage src={avatarSource ?? undefined} alt={displayName} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {displayName}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {email ?? member.userId}
            </p>
          </div>

          <Badge variant="outline" className="shrink-0 uppercase">
            {currentRole}
          </Badge>
        </div>

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
              name="role"
              children={(field) => {
                const showError =
                  field.state.meta.errors.length > 0 &&
                  (field.state.meta.isTouched || form.state.isSubmitted)
                const selectedRoleLabel =
                  roles.find((role) => role.role === field.state.value)?.role ||
                  field.state.value ||
                  copy.roleDescription

                return (
                  <Field data-invalid={showError}>
                    <FieldLabel htmlFor={field.name}>{copy.roleLabel}</FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={(role) => {
                        if (typeof role !== "string") {
                          return
                        }

                        field.handleChange(role)

                        if (updateMemberMutation.isError) {
                          updateMemberMutation.reset()
                        }
                      }}
                      disabled={isBusy || !hasRoles}
                    >
                      <SelectTrigger
                        id={field.name}
                        aria-label={copy.roleLabel}
                        className="w-full"
                      >
                        <SelectValue placeholder={copy.roleDescription}>
                          {() => <span className="truncate">{selectedRoleLabel}</span>}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent align="start" className="min-w-60">
                        <SelectGroup>
                          {roles.map((role) => (
                            <SelectItem
                              key={role.id}
                              value={role.role}
                              label={role.role}
                            >
                              <span className="truncate font-medium">
                                {role.role}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FieldDescription>{copy.roleDescription}</FieldDescription>
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )
              }}
            />
          </FieldGroup>

          {updateMemberMutation.error ? (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              <p className="font-medium">{copy.errorTitle}</p>
              <p className="mt-1">
                {updateMemberMutation.error.message || copy.genericError}
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
              const isSubmitDisabled =
                  !canSubmit || isSubmitting || updateMemberMutation.isPending

              return (
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="w-full sm:w-auto"
                    disabled={isSubmitDisabled}
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
                </div>
              )
            }}
          </form.Subscribe>
        </form>
      </CardContent>
    </Card>
  )
}
