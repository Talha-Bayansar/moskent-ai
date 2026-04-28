export type OrganizationRolePermissionMap = Record<string, Array<string>>

export type OrganizationRoleSummary = {
  id: string
  organizationId: string
  role: string
  permission: OrganizationRolePermissionMap
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
}

export type OrganizationRolesPage = {
  roles: Array<OrganizationRoleSummary>
  total: number
  nextCursor?: number
}
