import { Link, useMatchRoute } from "@tanstack/react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Home01Icon,
  UserGroupIcon,
  UserShield01Icon,
  UserTimeIcon,
} from "@hugeicons/core-free-icons"
import type { ReactNode } from "react"

import { OrganizationSwitcher } from "@/features/organizations/ui/organization-switcher"
import { m } from "@/shared/i18n"
import { Separator } from "@/shared/ui/separator"
import { ProfileMenu } from "@/shared/auth/ui/profile-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/shared/ui/sidebar"

type DashboardShellProps = {
  children: ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  const matchRoute = useMatchRoute()
  const isDashboardActive = Boolean(matchRoute({ to: "/dashboard" }))
  const isInvitationsActive = Boolean(matchRoute({ to: "/dashboard/invitations" }))
  const isMembersActive = Boolean(matchRoute({ to: "/dashboard/members" }))
  const isRolesActive = Boolean(matchRoute({ to: "/dashboard/roles" }))

  return (
    <SidebarProvider>
      <Sidebar variant="inset" collapsible="offcanvas">
        <SidebarHeader className="border-b border-sidebar-border/70 px-3 py-3">
          <OrganizationSwitcher />
        </SidebarHeader>

        <SidebarContent className="px-2 py-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={isDashboardActive}
                tooltip={m.dashboard_navigation_label()}
                render={<Link to="/dashboard" />}
              >
                <HugeiconsIcon
                  icon={Home01Icon}
                  strokeWidth={2}
                  data-icon="inline-start"
                />
                <span>{m.dashboard_navigation_label()}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={isInvitationsActive}
                tooltip={m.dashboard_invitations_label()}
                render={<Link to="/dashboard/invitations" />}
              >
                <HugeiconsIcon
                  icon={UserTimeIcon}
                  strokeWidth={2}
                  data-icon="inline-start"
                />
                <span>{m.dashboard_invitations_label()}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={isMembersActive}
                tooltip={m.dashboard_members_label()}
                render={<Link to="/dashboard/members" />}
              >
                <HugeiconsIcon
                  icon={UserGroupIcon}
                  strokeWidth={2}
                  data-icon="inline-start"
                />
                <span>{m.dashboard_members_label()}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={isRolesActive}
                tooltip={m.dashboard_roles_label()}
                render={<Link to="/dashboard/roles" />}
              >
                <HugeiconsIcon
                  icon={UserShield01Icon}
                  strokeWidth={2}
                  data-icon="inline-start"
                />
                <span>{m.dashboard_roles_label()}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border/70 p-3">
          <ProfileMenu />
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="min-h-svh bg-muted/20">
        <header className="sticky top-0 z-20 flex min-h-14 items-center gap-2 border-b border-border/70 bg-background/90 px-3 pt-[env(safe-area-inset-top)] backdrop-blur lg:min-h-16 lg:gap-3 lg:px-6 lg:pt-0">
          <SidebarTrigger className="-ml-1 size-9" />
          <Separator orientation="vertical" className="my-auto hidden h-5 sm:block" />
          <ProfileMenu
            showDisplayName={false}
            settingsHref="/dashboard/settings"
            className="border-border bg-background text-foreground hover:bg-muted lg:hidden"
          />
        </header>

        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-3 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:px-4 lg:px-6 lg:py-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
