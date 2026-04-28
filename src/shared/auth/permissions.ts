import { createAccessControl } from "better-auth/plugins/access"

export const organizationStatements = {
  organization: ["update", "delete"],
  member: ["create", "update", "delete"],
  invitation: ["create", "cancel"],
  team: ["create", "update", "delete"],
  ac: ["create", "read", "update", "delete"],
} as const

export const ac = createAccessControl(organizationStatements)

export const baselineOrganizationRolePermissions = {
  owner: {
    organization: ["update", "delete"],
    member: ["create", "update", "delete"],
    invitation: ["create", "cancel"],
    team: ["create", "update", "delete"],
    ac: ["create", "read", "update", "delete"],
  },
  admin: {
    organization: ["update"],
    invitation: ["create", "cancel"],
    member: ["create", "update", "delete"],
    team: ["create", "update", "delete"],
    ac: ["create", "read", "update", "delete"],
  },
  member: {
    organization: [],
    member: [],
    invitation: [],
    team: [],
    ac: ["read"],
  },
} as const

export type BaselineOrganizationRole =
  keyof typeof baselineOrganizationRolePermissions

export const baselineOrganizationRoleNames = Object.keys(
  baselineOrganizationRolePermissions
) as Array<BaselineOrganizationRole>

export const roles = {
  owner: ac.newRole(baselineOrganizationRolePermissions.owner),
  admin: ac.newRole(baselineOrganizationRolePermissions.admin),
  member: ac.newRole(baselineOrganizationRolePermissions.member),
}

export const organizationRoles = roles
