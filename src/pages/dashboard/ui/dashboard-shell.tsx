import { Link, useMatchRoute } from "@tanstack/react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import { Home01Icon } from "@hugeicons/core-free-icons"
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
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border/70 p-3">
          <ProfileMenu />
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="bg-muted/20">
        <header className="flex h-16 items-center gap-3 border-b border-border/70 bg-background/80 px-4 backdrop-blur md:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="my-auto h-5" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm leading-none font-medium">
              {m.dashboard_eyebrow()}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {m.dashboard_description()}
            </p>
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8 md:px-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
