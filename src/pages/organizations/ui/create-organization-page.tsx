"use client"

import { Link, useNavigate } from "@tanstack/react-router"

import { AuthPageShell } from "@/shared/auth/ui/auth-page-shell"
import { m } from "@/shared/i18n"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"

import { CreateOrganizationForm } from "@/features/organizations/create-organization/ui/create-organization-form"

export function CreateOrganizationPage() {
  const navigate = useNavigate()

  return (
    <AuthPageShell
      eyebrow={m.organization_create_eyebrow()}
      title={m.organization_create_title()}
      description={m.organization_create_description()}
      footer={
        <div className="flex flex-col items-center gap-2 text-center text-sm text-muted-foreground">
          <Link
            to="/dashboard"
            className="font-medium text-foreground/75 transition-colors hover:text-foreground"
          >
            {m.organization_create_back_dashboard()}
          </Link>
        </div>
      }
    >
      <Card size="sm" className="sm:py-6">
        <CardHeader>
          <CardTitle>{m.organization_create_card_title()}</CardTitle>
          <CardDescription>{m.organization_create_card_description()}</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateOrganizationForm
            onCreated={() => {
              navigate({ to: "/dashboard", replace: true })
            }}
            copy={{
              nameLabel: m.organization_create_name_label(),
              nameDescription: m.organization_create_name_description(),
              slugLabel: m.organization_create_slug_label(),
              slugDescription: m.organization_create_slug_description(),
              submitLabel: m.organization_create_submit(),
              submittingLabel: m.organization_create_submitting(),
              genericError: m.organization_create_generic_error(),
              errorTitle: m.organization_create_error_title(),
            }}
          />
        </CardContent>
      </Card>
    </AuthPageShell>
  )
}
