import type { organizationStatements } from "../permissions"

export type PermissionResource = keyof typeof organizationStatements

export type PermissionAction<
  Resource extends PermissionResource = PermissionResource,
> = (typeof organizationStatements)[Resource][number]

export type PermissionMap =
  | Partial<Record<PermissionResource, ReadonlyArray<string>>>
  | null
  | undefined

export function hasPermission<TResource extends PermissionResource>(
  permissionMap: PermissionMap,
  resource: TResource,
  action: PermissionAction<TResource>
) {
  return permissionMap?.[resource]?.includes(action) ?? false
}
