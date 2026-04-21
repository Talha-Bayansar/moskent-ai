import { describe, expect, it } from "vitest"

import { ac, roles } from "./permissions"

describe("shared organization permissions", () => {
  it("defines the shared baseline roles and role-management permissions", () => {
    expect(ac).toBeDefined()
    expect(Object.keys(roles).sort()).toEqual(["admin", "member", "owner"])
    expect(
      roles.owner.authorize({
        ac: ["create", "update", "delete"],
      }).success
    ).toBe(true)
    expect(
      roles.member.authorize({
        ac: ["create"],
      }).success
    ).toBe(false)
  })
})
