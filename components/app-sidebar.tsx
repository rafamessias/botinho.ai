"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations("AppSidebar")

  const data = {
    user: {
      name: "Rafael Messias",
      email: "contact@rafaelmessias.com",
      avatar: "/placeholder-user.png",
    },
    navMain: [
      {
        title: t("navigation.dashboard"),
        url: "/",
        icon: IconDashboard,
      },
      {
        title: t("navigation.lifecycle"),
        url: "/lifecycle",
        icon: IconListDetails,
      },
      {
        title: t("navigation.analytics"),
        url: "/analytics",
        icon: IconChartBar,
      },
      {
        title: t("navigation.projects"),
        url: "/projects",
        icon: IconFolder,
      },
      {
        title: t("navigation.team"),
        url: "/team",
        icon: IconUsers,
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
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">My SaaS</span>
              </a>
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
