"use client"

import { useState } from "react"
import { useForm } from "@tanstack/react-form"
import { HugeiconsIcon } from "@hugeicons/react"
import { UserShield01Icon } from "@hugeicons/core-free-icons"
import { Link } from "@tanstack/react-router"

import { baselineOrganizationRoleNames } from "@/shared/auth/permissions"
import { m } from "@/shared/i18n"
import { cn } from "@/shared/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card"
import { Checkbox } from "@/shared/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldSet,
  FieldLegend,
} from "@/shared/ui/field"
import { Input } from "@/shared/ui/input"
import { Spinner } from "@/shared/ui/spinner"

import { useCreateOrganizationRoleMutation } from "../model/mutations"
import {
  createEmptyRolePermissionMap,
  createRoleNameDraftSchema,
  normalizeRoleName,
  rolePermissionEntries,
} from "../model/schema"

export type CreateRoleFormCopy = {
  cardTitle: string
  cardDescription: string
  roleLabel: string
  roleDescription: string
  rolePlaceholder: string
  permissionsLabel: string
  permissionsDescription: string
  submitLabel: string
  submittingLabel: string
  successTitle: string
  successDescription: string
  successBody: string
  createAnotherLabel: string
  backLabel: string
  errorTitle: string
  genericError: string
}

type CreateRoleFormProps = {
  copy: CreateRoleFormCopy
  organizationId: string | null
  className?: string
}

function getPermissionLabel(resource: string) {
  switch (resource) {
    case "organization":
      return m.roles_permission_organization_label()
    case "member":
      return m.roles_permission_member_label()
    case "invitation":
      return m.roles_permission_invitation_label()
    case "team":
      return m.roles_permission_team_label()
    case "ac":
      return m.roles_permission_ac_label()
    default:
      return resource
  }
}

function getActionLabel(action: string) {
  switch (action) {
    case "create":
      return m.roles_permission_create_label()
    case "read":
      return m.roles_permission_read_label()
    case "update":
      return m.roles_permission_update_label()
    case "delete":
      return m.roles_permission_delete_label()
    case "cancel":
      return m.roles_permission_cancel_label()
    default:
      return action
  }
}

function isBaselineRole(roleName: string) {
  return baselineOrganizationRoleNames.includes(
    roleName as (typeof baselineOrganizationRoleNames)[number]
  )
}

export function CreateRoleForm({
  copy,
  organizationId,
  className,
}: CreateRoleFormProps) {
  const [permissionMap, setPermissionMap] = useState(
    createEmptyRolePermissionMap()
  )
  const [createdRoleName, setCreatedRoleName] = useState<string | null>(null)
  const createRoleMutation = useCreateOrganizationRoleMutation(organizationId)

  const form = useForm({
    defaultValues: {
      role: "",
    },
    validators: {
      onSubmit: createRoleNameDraftSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const normalizedRoleName = normalizeRoleName(value.role)

        await createRoleMutation.mutateAsync({
          role: normalizedRoleName,
          permission: permissionMap,
        })

        setCreatedRoleName(normalizedRoleName)
        form.reset()
        setPermissionMap(createEmptyRolePermissionMap())
      } catch {
        // The mutation error is surfaced inline.
      }
    },
  })

  if (createdRoleName) {
    return (
      <Card className={cn("bg-card/80", className)}>
        <CardHeader>
          <div className="flex size-11 items-center justify-center rounded-2xl border border-border bg-background text-foreground shadow-xs">
            <HugeiconsIcon icon={UserShield01Icon} strokeWidth={2} />
          </div>
          <CardTitle>{copy.successTitle}</CardTitle>
          <CardDescription>{copy.successDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border/70 bg-background px-4 py-3">
            <span className="text-sm text-muted-foreground">
              {copy.successBody}
            </span>
            <Badge variant={isBaselineRole(createdRoleName) ? "secondary" : "outline"} className="uppercase">
              {createdRoleName}
            </Badge>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => {
              createRoleMutation.reset()
              setCreatedRoleName(null)
              setPermissionMap(createEmptyRolePermissionMap())
              form.reset()
            }}
          >
            {copy.createAnotherLabel}
          </Button>
          <Button className="w-full sm:w-auto" render={<Link to="/dashboard/roles" />}>
            {copy.backLabel}
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
              name="role"
              children={(field) => {
                const showError =
                  field.state.meta.errors.length > 0 &&
                  (field.state.meta.isTouched || form.state.isSubmitted)

                return (
                  <Field data-invalid={showError}>
                    <label
                      htmlFor={field.name}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {copy.roleLabel}
                    </label>
                    <Input
                      id={field.name}
                      name={field.name}
                      autoComplete="off"
                      placeholder={copy.rolePlaceholder}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => {
                        field.handleChange(event.target.value)

                        if (createRoleMutation.isError) {
                          createRoleMutation.reset()
                        }
                      }}
                      aria-invalid={showError}
                    />
                    <FieldDescription>{copy.roleDescription}</FieldDescription>
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )
              }}
            />
          </FieldGroup>

          <FieldSet className="gap-4">
            <FieldLegend variant="label" className="mb-0 text-sm font-medium">
              {copy.permissionsLabel}
            </FieldLegend>
            <p className="text-sm leading-6 text-muted-foreground">
              {copy.permissionsDescription}
            </p>

            <div className="grid gap-4 lg:grid-cols-2">
              {rolePermissionEntries.map(([resource, actions]) => {
                const selectedActions = permissionMap[resource] ?? []
                const resourceKey = `role-permission-${resource}`

                return (
                  <div
                    key={resource}
                    className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-background p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium text-foreground">
                          {getPermissionLabel(resource)}
                        </h3>
                        <p className="text-xs leading-5 text-muted-foreground">
                          {copy.permissionsDescription}
                        </p>
                      </div>
                      <Badge variant="outline" className="uppercase">
                        {selectedActions.length}/{actions.length}
                      </Badge>
                    </div>

                    <div className="grid gap-2">
                      {actions.map((action) => {
                        const isChecked = selectedActions.includes(action)
                        const fieldId = `${resourceKey}-${action}`

                        return (
                          <label
                            key={action}
                            htmlFor={fieldId}
                            className={cn(
                              "flex items-start gap-3 rounded-2xl border border-border/70 px-3 py-3 transition-colors",
                              "bg-background hover:bg-muted/40"
                            )}
                          >
                            <Checkbox
                              id={fieldId}
                              checked={isChecked}
                              onCheckedChange={(checked) => {
                                const nextSelected = checked
                                  ? Array.from(new Set([...selectedActions, action]))
                                  : selectedActions.filter((item) => item !== action)

                                setPermissionMap((current) => ({
                                  ...current,
                                  [resource]: nextSelected,
                                }))

                                if (createRoleMutation.isError) {
                                  createRoleMutation.reset()
                                }
                              }}
                              className="mt-0.5"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-foreground">
                                  {getActionLabel(action)}
                                </span>
                                <Badge variant="outline" className="uppercase">
                                  {m.roles_permission_available_label()}
                                </Badge>
                              </div>
                              <p className="text-xs leading-5 text-muted-foreground">
                                {m.roles_permission_available_description()}
                              </p>
                            </div>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </FieldSet>

          {createRoleMutation.error ? (
            <Alert variant="destructive">
              <AlertTitle>{copy.errorTitle}</AlertTitle>
              <AlertDescription>
                {createRoleMutation.error.message || copy.genericError}
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
              const isBusy = isSubmitting || createRoleMutation.isPending

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
