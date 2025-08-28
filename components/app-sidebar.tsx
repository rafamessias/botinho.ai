"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
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
      name: t("user.name"),
      email: t("user.email"),
      avatar: "/placeholder-user.png",
    },
    navMain: [
      {
        title: t("navigation.dashboard"),
        url: "#",
        icon: IconDashboard,
      },
      {
        title: t("navigation.lifecycle"),
        url: "#",
        icon: IconListDetails,
      },
      {
        title: t("navigation.analytics"),
        url: "#",
        icon: IconChartBar,
      },
      {
        title: t("navigation.projects"),
        url: "#",
        icon: IconFolder,
      },
      {
        title: t("navigation.team"),
        url: "#",
        icon: IconUsers,
      },
    ],

    navSecondary: [
      {
        title: t("secondary.settings"),
        url: "#",
        icon: IconSettings,
      },
      {
        title: t("secondary.getHelp"),
        url: "#",
        icon: IconHelp,
      },
    ],
    documents: [
      {
        name: t("documents.dataLibrary"),
        url: "#",
        icon: IconDatabase,
      },
      {
        name: t("documents.reports"),
        url: "#",
        icon: IconReport,
      },
      {
        name: t("documents.wordAssistant"),
        url: "#",
        icon: IconFileWord,
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
                <span className="text-base font-semibold">{t("brand")}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
