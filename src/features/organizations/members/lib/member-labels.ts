import type { OrganizationMemberSummary } from "../model/types"

export function getMemberDisplayName(member: OrganizationMemberSummary) {
  const user = member.user

  return (
    user?.name?.trim() ||
    user?.email?.split("@")[0]?.trim() ||
    member.name?.trim() ||
    member.email?.split("@")[0]?.trim() ||
    member.userId ||
    "Member"
  )
}

export function getMemberEmail(member: OrganizationMemberSummary) {
  return (
    member.user?.email?.trim() ||
    member.email?.trim() ||
    member.userId ||
    null
  )
}

export function getMemberAvatarSource(member: OrganizationMemberSummary) {
  return member.user?.image || member.image || null
}

export function getMemberAvatarFallback(member: OrganizationMemberSummary) {
  const displayName = getMemberDisplayName(member)
  const parts = displayName.trim().split(/\s+/).filter(Boolean)

  const initials = parts.slice(0, 2).map((part) => part[0]).join("")

  return (initials || displayName.trim().slice(0, 2) || "M").toUpperCase()
}

export function formatMemberRoleLabel(role: OrganizationMemberSummary["role"]) {
  if (Array.isArray(role)) {
    return role.join(", ")
  }

  return role ?? "member"
}

export function normalizeMemberRoleValue(
  role: OrganizationMemberSummary["role"]
) {
  if (Array.isArray(role)) {
    return role.find((value) => value.trim().length > 0)?.trim() ?? ""
  }

  return role?.trim() ?? ""
}
