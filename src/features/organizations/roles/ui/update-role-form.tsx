"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { UserEdit01Icon } from "@hugeicons/core-free-icons"

import { useUpdateOrganizationRoleMutation } from "../model/mutations"
import {
  normalizeRolePermissionMap,
  rolePermissionEntries,
} from "../model/schema"
import type { OrganizationRoleSummary } from "../model/types"
import { baselineOrganizationRoleNames } from "@/shared/auth/permissions"
import { m } from "@/shared/i18n"
import { cn } from "@/shared/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { Checkbox } from "@/shared/ui/checkbox"
import { FieldLegend, FieldSet } from "@/shared/ui/field"
import { Spinner } from "@/shared/ui/spinner"

export type UpdateRoleFormCopy = {
  cardTitle: string
  cardDescription: string
  permissionsLabel: string
  permissionsDescription: string
  submitLabel: string
  submittingLabel: string
  errorTitle: string
  genericError: string
}

type UpdateRoleFormProps = {
  role: OrganizationRoleSummary
  organizationId: string | null
  copy: UpdateRoleFormCopy
  className?: string
  onSuccess?: () => void
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

export function UpdateRoleForm({
  role,
  organizationId,
  copy,
  className,
  onSuccess,
}: UpdateRoleFormProps) {
  const [permissionMap, setPermissionMap] = useState(
    normalizeRolePermissionMap(role.permission)
  )
  const updateRoleMutation = useUpdateOrganizationRoleMutation({
    onSuccess: () => {
      onSuccess?.()
    },
  })

  const isBusy = updateRoleMutation.isPending
  const currentRoleKey = role.role.trim() || "member"
  const currentRoleName = role.role.trim() || m.roles_member_fallback()

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
        <div className="mb-6 flex flex-wrap items-center gap-2 rounded-2xl border border-border/70 bg-background px-4 py-3">
          <span className="text-sm text-muted-foreground">
            {isBaselineRole(currentRoleKey)
              ? m.roles_default_badge()
              : m.roles_custom_badge()}
          </span>
          <Badge
            variant={isBaselineRole(currentRoleKey) ? "secondary" : "outline"}
            className="uppercase"
          >
            {currentRoleName}
          </Badge>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()

            void updateRoleMutation.mutateAsync({
              organizationId,
              roleId: role.id,
              permission: permissionMap,
            }).catch(() => {
              // The mutation error is surfaced inline.
            })
          }}
          className="flex flex-col gap-6"
        >
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

                                if (updateRoleMutation.isError) {
                                  updateRoleMutation.reset()
                                }
                              }}
                              className="mt-0.5"
                              disabled={isBusy}
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

          {updateRoleMutation.error ? (
            <Alert variant="destructive">
              <AlertTitle>{copy.errorTitle}</AlertTitle>
              <AlertDescription>
                {updateRoleMutation.error.message || copy.genericError}
              </AlertDescription>
            </Alert>
          ) : null}

          <div className="flex justify-end">
            <Button type="submit" className="w-full sm:w-auto" disabled={isBusy}>
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
        </form>
      </CardContent>
    </Card>
  )
}
