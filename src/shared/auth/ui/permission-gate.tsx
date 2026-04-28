"use client"

import type { ReactNode } from "react"

import { useCurrentUserQuery } from "@/shared/auth/model/current-user"
import { hasPermission } from "@/shared/auth/model/permission-checks"
import type {
  PermissionAction,
  PermissionResource,
} from "@/shared/auth/model/permission-checks"

type PermissionGateProps<TResource extends PermissionResource> = {
  resource: TResource
  action: PermissionAction<TResource>
  children: ReactNode
  fallback?: ReactNode
  pendingFallback?: ReactNode
}

export function PermissionGate<TResource extends PermissionResource>({
  resource,
  action,
  children,
  fallback = null,
  pendingFallback = null,
}: PermissionGateProps<TResource>) {
  const currentUserState = useCurrentUserQuery()

  if (currentUserState.isPending) {
    return pendingFallback
  }

  if (currentUserState.isError) {
    return fallback
  }

  const permissionMap =
    currentUserState.data?.activeOrganizationRole?.permission ?? null

  if (!hasPermission(permissionMap, resource, action)) {
    return fallback
  }

  return <>{children}</>
}
