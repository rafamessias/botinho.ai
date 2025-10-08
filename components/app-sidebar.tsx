"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import {
  IconDashboard,
  IconListDetails,
  IconSettings,
  IconUsers
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { BarChart3, AlertTriangle } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { useUser } from "@/components/user-provider"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations("AppSidebar")
  const { usagePercentage } = useUser()

  const data = {
    navMain: [
      {
        title: t("navigation.dashboard"),
        url: "/",
        icon: IconDashboard,
      },
      {
        title: t("navigation.surveys"),
        url: "/survey",
        icon: IconListDetails,
      },
      {
        title: t("navigation.team"),
        url: "/team",
        icon: IconUsers,
      },
      {
        title: t("navigation.settings"),
        icon: IconSettings,
        url: '/settings',
      },
    ],

  }
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <span className="bg-primary rounded-sm p-1">
                  <BarChart3 className="h-5 w-5 text-primary-foreground" />
                </span>
                <span className="text-base font-semibold">Opineeo</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        {usagePercentage >= 75 && (
          <Link
            href="/subscription"
            className="flex items-center gap-2 px-3 py-2 mb-2 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100 hover:bg-amber-100 dark:hover:bg-amber-900 transition-colors"
            aria-label="Usage warning - upgrade plan"
          >
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <div className="flex flex-col text-xs">
              <span className="font-semibold">Usage: {Math.trunc(usagePercentage)}%</span>
              <span className="text-amber-700 dark:text-amber-300">Upgrade plan</span>
            </div>
          </Link>
        )}
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
