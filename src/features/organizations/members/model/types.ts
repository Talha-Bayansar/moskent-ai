export type OrganizationMemberUserSummary = {
  id?: string
  name?: string | null
  email?: string | null
  image?: string | null
}

export type OrganizationMemberSummary = {
  id: string
  organizationId?: string
  userId?: string
  role?: string | Array<string> | null
  createdAt?: string | Date | null
  user?: OrganizationMemberUserSummary | null
  name?: string | null
  email?: string | null
  image?: string | null
}

export type OrganizationMembersPage = {
  members: Array<OrganizationMemberSummary>
  total: number
  nextCursor?: number
}
