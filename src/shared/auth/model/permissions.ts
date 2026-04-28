import { createAccessControl } from "better-auth/plugins/access"
import {
  adminAc,
  defaultStatements,
  memberAc,
  ownerAc,
} from "better-auth/plugins/organization/access"

const statement = {
  ...defaultStatements,
  ac: ["create", "read", "update", "delete"],
} as const

export const ac = createAccessControl(statement)

export const roles = {
  owner: ac.newRole({
    ...ownerAc.statements,
    ac: ["create", "read", "update", "delete"],
  }),
  admin: ac.newRole({
    ...adminAc.statements,
    ac: ["create", "read", "update", "delete"],
  }),
  member: ac.newRole({
    ...memberAc.statements,
  }),
}

export const organizationRoles = roles
export const organizationStatements = statement
