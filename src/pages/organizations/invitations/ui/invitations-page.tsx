"use client"

import { OrganizationInvitationsPageContent } from "@/features/organizations/invitations/ui/organization-invitations-page-content"
import { OrganizationAccessShell } from "@/shared/auth/ui/organization-access-shell"

export function OrganizationsInvitationsPage() {
  return (
    <OrganizationAccessShell>
      <OrganizationInvitationsPageContent />
    </OrganizationAccessShell>
  )
}
