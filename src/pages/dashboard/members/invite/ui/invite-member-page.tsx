"use client"

import { ArrowLeft01Icon, MailAdd01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Link } from "@tanstack/react-router"

import { InviteOrganizationForm } from "@/features/organizations/invitations/ui/invite-organization-form"
import { useAuthSessionQuery } from "@/shared/auth/model/session"
import { m } from "@/shared/i18n"
import { Button } from "@/shared/ui/button"

export function InviteMemberPage() {
  const sessionState = useAuthSessionQuery()
  const organizationId = sessionState.data?.session.activeOrganizationId ?? null

  return (
    <section className="flex flex-col gap-5 md:gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="flex max-w-3xl flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl border border-border bg-background text-foreground shadow-xs">
              <HugeiconsIcon icon={MailAdd01Icon} strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                {m.organization_invite_eyebrow()}
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {m.organization_invite_title()}
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
                {m.organization_invite_description()}
              </p>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full sm:w-auto"
          render={<Link to="/dashboard/members" />}
        >
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            strokeWidth={2}
            data-icon="inline-start"
          />
          {m.organization_invite_back_members()}
        </Button>
      </div>

      <InviteOrganizationForm
        organizationId={organizationId}
        copy={{
          cardTitle: m.organization_invite_card_title(),
          cardDescription: m.organization_invite_card_description(),
          emailLabel: m.organization_invite_email_label(),
          emailDescription: m.organization_invite_email_description(),
          submitLabel: m.organization_invite_submit(),
          submittingLabel: m.organization_invite_submitting(),
          successTitle: m.organization_invite_success_title(),
          successDescription: m.organization_invite_success_description(),
          successBody: m.organization_invite_success_body(),
          errorTitle: m.organization_invite_error_title(),
          genericError: m.organization_invite_generic_error(),
          backMembersLabel: m.organization_invite_back_members(),
          inviteAnotherLabel: m.organization_invite_invite_another(),
        }}
      />
    </section>
  )
}
