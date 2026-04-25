"use client"

import { Link } from "@tanstack/react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  UserAdd01Icon,
  UserTimeIcon,
} from "@hugeicons/core-free-icons"

import { m } from "@/shared/i18n"
import { Button } from "@/shared/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card"
import { OrganizationAccessShell } from "@/shared/auth/ui/organization-access-shell"

export function OrganizationsHubPage() {
  return (
    <OrganizationAccessShell>
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-5 md:gap-8">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {m.organization_access_eyebrow()}
          </p>
          <div className="flex max-w-3xl flex-col gap-3">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {m.organization_access_title()}
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
              {m.organization_access_description()}
            </p>
          </div>
        </div>

        <div className="grid w-full gap-4 lg:grid-cols-2">
          <Card size="sm" className="h-full sm:py-6">
            <CardHeader>
              <div className="flex size-11 items-center justify-center rounded-2xl border border-border bg-background text-foreground shadow-xs">
                <HugeiconsIcon icon={UserAdd01Icon} strokeWidth={2} />
              </div>
              <CardTitle>{m.organization_create_card_title()}</CardTitle>
              <CardDescription>
                {m.organization_create_card_description()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" render={<Link to="/organizations/new" />}>
                {m.organization_create_submit()}
              </Button>
            </CardContent>
          </Card>

          <Card size="sm" className="h-full sm:py-6">
            <CardHeader>
              <div className="flex size-11 items-center justify-center rounded-2xl border border-border bg-background text-foreground shadow-xs">
                <HugeiconsIcon icon={UserTimeIcon} strokeWidth={2} />
              </div>
              <CardTitle>{m.organization_invitations_section_title()}</CardTitle>
              <CardDescription>
                {m.organization_invitations_section_description()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" render={<Link to="/organizations/invitations" />}>
                {m.dashboard_invitations_label()}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </OrganizationAccessShell>
  )
}
