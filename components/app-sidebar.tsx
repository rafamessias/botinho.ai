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
import { BarChart3 } from "lucide-react"
import { Link } from "@/i18n/navigation"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations("AppSidebar")

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
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
