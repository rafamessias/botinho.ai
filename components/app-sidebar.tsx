"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import {
  IconDashboard,
  IconHelp,
  IconListDetails,
  IconSettings,
  IconUsers,
  IconMessageCircle,
  IconUserCircle,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,

} from "@/components/ui/sidebar"
import { AlertTriangle, ArrowRight, } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { useUser } from "@/components/user-provider"
import Image from "next/image"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations("AppSidebar")
  const { usagePercentage } = useUser()

  const data = {
    navMain: [
      {
        title: t("navigation.dashboard"),
        url: "/dashboard",
        icon: IconDashboard,
      },
      {
        title: t("navigation.inbox"),
        url: "/inbox",
        icon: IconMessageCircle,
      },
      {
        title: t("navigation.customer"),
        url: "/customer",
        icon: IconUserCircle,
      },
      {
        title: t("navigation.aiTraining"),
        url: "/ai-training",
        icon: IconListDetails,
      },
      {
        title: t("navigation.company"),
        url: "/company",
        icon: IconUsers,
      },
      {
        title: t("navigation.settings"),
        icon: IconSettings,
        url: '/settings',
      },
      {
        title: t("navigation.support"),
        url: "/support",
        icon: IconHelp,
      },
    ],

  }
  return (
    <Sidebar className="border-r p-0" collapsible="offcanvas" {...props}>
      <SidebarHeader className="p-0 h-[48px]">
        <SidebarMenu >

          <div className="flex items-center gap-3 pl-1">
            <div className="relative h-[55px] w-[125px]">
              <Image
                src="/logo-green.png"
                alt="botinho.ai"
                fill
                className="object-contain dark:hidden"
              />
              <Image
                src="/logo-white.png"
                alt="botinho.ai"
                fill
                className="hidden object-contain dark:block"
              />
            </div>
          </div>

        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        {/* 
          More discrete and elegant usage alert. Uses a subtle icon and a small pill on the sidebar footer,
          with a minimal tooltip text and muted background. No border, gentle hover, uses appropriate color for context.
        */}
        {usagePercentage >= 65 && usagePercentage < 80 && (
          <Link
            href="/subscription"
            className="flex items-center gap-1 mb-2 px-2 py-1.5 rounded-full bg-cyan-100/50 dark:bg-cyan-900/70 hover:bg-cyan-200/80 dark:hover:bg-cyan-800/80 text-cyan-800 dark:text-cyan-100 text-xs transition-colors justify-between"
            aria-label="Usage approaching limit"
            title="Starting to reach plan limit"
          >
            <div className="flex items-center gap-1">
              <AlertTriangle className="h-4 w-4 text-cyan-500 dark:text-cyan-300 mr-1" />
              <span className="font-medium">
                {Math.trunc(usagePercentage)}%
              </span>
              <span className="ml-1 ">Limit utilization</span>
            </div>
            <ArrowRight className="h-4 w-4 text-cyan-500 dark:text-cyan-300 mr-1" />
          </Link>
        )}
        {usagePercentage >= 80 && usagePercentage < 100 && (
          <Link
            href="/subscription"
            className="flex items-center gap-1 mb-2 px-2 py-1.5 rounded-full accent-orange text-xs transition-colors justify-between"
            aria-label="Usage warning"
            title="Almost reached your plan's limit"
          >
            <div className="flex items-center gap-1">
              <AlertTriangle className="h-4 w-4 text-orange-500 dark:text-orange-300 mr-1" />
              <span className="font-medium">
                {Math.trunc(usagePercentage)}%
              </span>
              <span className="ml-1 ">Limit utilization</span>
            </div>
            <ArrowRight className="h-4 w-4 text-orange-500 dark:text-orange-300 mr-1" />
          </Link>
        )}
        {usagePercentage >= 100 && (
          <Link
            href="/subscription"
            className="flex items-center gap-1 mb-2 px-2 py-1.5 rounded-full bg-rose-100/60 dark:bg-rose-900/80 hover:bg-rose-200 dark:hover:bg-rose-800 text-rose-800 dark:text-rose-100 text-xs transition-colors font-bold justify-between"
            aria-label="Limit reached"
            title="Plan limit reached. Upgrade required."
          >
            <div className="flex items-center gap-1">
              <AlertTriangle className="h-4 w-4 text-rose-500 dark:text-rose-300 mr-1" />
              <span className="font-bold">
                {Math.trunc(usagePercentage)}%
              </span>
              <span className="ml-1 ">Limit reached</span>
            </div>
            <ArrowRight className="h-4 w-4 text-rose-500 dark:text-rose-300 mr-1" />
          </Link>
        )}
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
