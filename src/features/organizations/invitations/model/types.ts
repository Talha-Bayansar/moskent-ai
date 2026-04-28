export type OrganizationInvitationOrganizationSummary = {
  id?: string
  name?: string | null
  slug?: string | null
  logo?: string | null
}

export type OrganizationInvitationUserSummary = {
  id?: string
  name?: string | null
  email?: string | null
  image?: string | null
}

export type OrganizationInvitationSummary = {
  id: string
  email?: string | null
  role?: string | Array<string> | null
  status?: string | null
  createdAt?: string | Date | null
  expiresAt?: string | Date | null
  organizationId?: string
  organizationName?: string | null
  organizationSlug?: string | null
  organizationLogo?: string | null
  organization?: OrganizationInvitationOrganizationSummary | null
  inviter?:
    | {
        user?: OrganizationInvitationUserSummary | null
      }
    | null
}
