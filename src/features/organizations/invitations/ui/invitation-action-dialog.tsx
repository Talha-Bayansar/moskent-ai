"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog"
import type { OrganizationInvitationSummary } from "../model/types"
import { m } from "@/shared/i18n"

type InvitationActionDialogProps = {
  invitation: OrganizationInvitationSummary | null
  action: "accept" | "reject" | null
  open: boolean
  isPending?: boolean
  error?: string | null
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

function getOrganizationLabel(invitation: OrganizationInvitationSummary | null) {
  return (
    invitation?.organizationName?.trim() ||
    invitation?.organization?.name?.trim() ||
    m.organization_invitations_unknown_organization()
  )
}

export function InvitationActionDialog({
  invitation,
  action,
  open,
  isPending = false,
  error,
  onOpenChange,
  onConfirm,
}: InvitationActionDialogProps) {
  const organizationLabel = getOrganizationLabel(invitation)
  const isAcceptAction = action === "accept"

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isAcceptAction
              ? m.organization_invitations_accept_title()
              : m.organization_invitations_reject_title()}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isAcceptAction
              ? m.organization_invitations_accept_description({
                  organization: organizationLabel,
                })
              : m.organization_invitations_reject_description({
                  organization: organizationLabel,
                })}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">
            {m.organization_invitations_cancel()}
          </AlertDialogCancel>
          <AlertDialogAction
            variant={isAcceptAction ? "default" : "destructive"}
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending
              ? m.organization_invitations_submitting()
              : isAcceptAction
                ? m.organization_invitations_accept_confirm()
                : m.organization_invitations_reject_confirm()}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
