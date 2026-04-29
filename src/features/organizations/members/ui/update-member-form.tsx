"use client"

import { useDeferredValue, useState } from "react"
import { useForm } from "@tanstack/react-form"
import { HugeiconsIcon } from "@hugeicons/react"
import { UserEdit01Icon } from "@hugeicons/core-free-icons"

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
import type { OrganizationMemberSummary } from "../model/types"
import { useOrganizationRolesInfiniteQuery } from "@/features/organizations/roles/model/queries"
import { cn } from "@/shared/lib/utils"
import { AsyncSelect } from "@/shared/ui/async-select"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
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
import { Spinner } from "@/shared/ui/spinner"

type UpdateMemberFormCopy = {
  cardTitle: string
  cardDescription: string
  roleLabel: string
  roleDescription: string
  roleSelectPlaceholder: string
  roleSelectSearchPlaceholder: string
  roleSelectLoadingLabel: string
  roleSelectEmptyLabel: string
  submitLabel: string
  submittingLabel: string
  errorTitle: string
  genericError: string
}

type UpdateMemberFormProps = {
  member: OrganizationMemberSummary
  organizationId: string | null
  copy: UpdateMemberFormCopy
  className?: string
  onSuccess?: () => void
}

export function UpdateMemberForm({
  member,
  organizationId,
  copy,
  className,
  onSuccess,
}: UpdateMemberFormProps) {
  const defaultRole = normalizeMemberRoleValue(member.role)
  const [roleSearchValue, setRoleSearchValue] = useState(defaultRole)
  const deferredRoleSearchValue = useDeferredValue(roleSearchValue)

  const updateMemberMutation = useUpdateOrganizationMemberMutation({
    onSuccess: () => {
      onSuccess?.()
    },
  })
  const rolesQuery = useOrganizationRolesInfiniteQuery({
    organizationId,
    search: deferredRoleSearchValue,
    enabled: Boolean(organizationId),
  })
  const roles = rolesQuery.data?.pages.flatMap((page) => page.roles) ?? []

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

                return (
                  <Field data-invalid={showError}>
                    <FieldLabel htmlFor={field.name}>{copy.roleLabel}</FieldLabel>
                    <AsyncSelect
                      id={field.name}
                      value={field.state.value}
                      onValueChange={(role) => {
                        field.handleChange(role ?? "")

                        if (updateMemberMutation.isError) {
                          updateMemberMutation.reset()
                        }
                      }}
                      searchValue={roleSearchValue}
                      onSearchValueChange={(value) => {
                        setRoleSearchValue(value)

                        if (updateMemberMutation.isError) {
                          updateMemberMutation.reset()
                        }
                      }}
                      items={roles}
                      getItemKey={(role) => role.id}
                      getItemValue={(role) => role.role}
                      getItemLabel={(role) => role.role}
                      getValueLabel={(value) =>
                        roles.find((role) => role.role === value)?.role ?? value
                      }
                      renderItem={(role) => (
                        <span className="truncate font-medium">{role.role}</span>
                      )}
                      placeholder={copy.roleSelectPlaceholder}
                      searchPlaceholder={copy.roleSelectSearchPlaceholder}
                      loadingLabel={copy.roleSelectLoadingLabel}
                      emptyLabel={copy.roleSelectEmptyLabel}
                      disabled={isBusy}
                      hasNextPage={rolesQuery.hasNextPage}
                      isFetchingNextPage={rolesQuery.isFetchingNextPage}
                      isPending={rolesQuery.isPending}
                      error={rolesQuery.error}
                      onLoadMore={() => {
                        if (rolesQuery.hasNextPage && !rolesQuery.isFetchingNextPage) {
                          void rolesQuery.fetchNextPage()
                        }
                      }}
                      errorState={
                        <div className="px-3 py-4 text-center text-sm text-destructive">
                          {rolesQuery.error?.message || copy.genericError}
                        </div>
                      }
                      className="w-full"
                      contentClassName="min-w-72"
                    />
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
