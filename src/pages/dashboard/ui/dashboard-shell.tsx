import { Link } from "@tanstack/react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import { Home01Icon } from "@hugeicons/core-free-icons"
import type { ReactNode } from "react"

import { LocaleSwitcher } from "@/shared/i18n/locale-switcher"
import { m } from "@/shared/i18n"
import { Separator } from "@/shared/ui/separator"
import {
  Sidebar,
  SidebarContent,
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
  return (
    <SidebarProvider>
      <Sidebar variant="inset" collapsible="offcanvas">
        <SidebarHeader className="border-b border-sidebar-border/70 px-3 py-3">
          <div className="flex items-center gap-3 px-1 py-1">
            <div className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-xs font-semibold text-sidebar-primary-foreground">
              MA
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm leading-none font-medium text-sidebar-foreground">
                {m.app_title()}
              </p>
              <p className="truncate text-xs text-sidebar-foreground/70">
                {m.home_dashboard_label()}
              </p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-2 py-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive
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
          <LocaleSwitcher />
        </header>

        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8 md:px-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
