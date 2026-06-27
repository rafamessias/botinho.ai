"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import {
  IconDashboard,
  IconHelp,
  IconRobot,
  IconBrandWhatsapp,
  IconUsers,
  IconMessageCircle,
  IconUserCircle,
  IconCreditCard,
  IconMessage,
  IconTemplate,
} from "@tabler/icons-react"

import { BrandLogo } from "@/components/brand-logo"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar"
import { AlertTriangle, ArrowRight } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { useUser } from "@/components/user-provider"
import Image from "next/image"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations("AppSidebar")
  const { usagePercentage } = useUser()

  const navGroups = [
    {
      label: t("sections.workspace"),
      items: [
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
      ],
    },
    {
      label: t("sections.aiInteraction"),
      items: [
        {
          title: t("navigation.aiAgents"),
          url: "/ai-agents",
          icon: IconRobot,
        },
        {
          title: t("navigation.quickAnswers"),
          url: "/quick-answers",
          icon: IconMessage,
        },
        {
          title: t("navigation.templates"),
          url: "/templates",
          icon: IconTemplate,
        },
      ],
    },
    {
      label: t("sections.management"),
      items: [
        {
          title: t("navigation.company"),
          url: "/company",
          icon: IconUsers,
        },
        {
          title: t("navigation.connectWhatsApp"),
          icon: IconBrandWhatsapp,
          url: "/settings",
        },
        {
          title: t("navigation.subscription"),
          url: "/subscription",
          icon: IconCreditCard,
        },
        {
          title: t("navigation.support"),
          url: "/support",
          icon: IconHelp,
        },
      ],
    },
  ]
  return (
    <Sidebar
      className="border-r border-border/60 bg-background/80 backdrop-blur pt-0"
      collapsible="icon"
      {...props}
    >
      <SidebarHeader className="flex h-(--header-height) shrink-0 flex-row items-center gap-0 px-1 py-0">
        <SidebarMenu className="h-full w-full px-2">
          <Link
            href="/"
            aria-label="botinho.ai home"
            className="flex h-full w-full items-center justify-start p-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2"
            tabIndex={0}
          >
            <BrandLogo
              className="h-8 w-auto max-w-[135px] object-contain object-left group-data-[collapsible=icon]:hidden"
              priority
            />
            <div className="relative hidden size-8 shrink-0 group-data-[collapsible=icon]:block">
              <Image
                src="/bot-green.svg"
                alt="botinho.ai"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-1">
        <NavMain groups={navGroups} />
      </SidebarContent>
      <SidebarFooter>
        {/* 
          More discrete and elegant usage alert. Uses a subtle icon and a small pill on the sidebar footer,
          with a minimal tooltip text and muted background. No border, gentle hover, uses appropriate color for context.
        */}
        {usagePercentage >= 65 && usagePercentage < 80 && (
          <Link
            href="/subscription"
            className="mb-3 flex items-center justify-between gap-2 rounded-full bg-cyan-100/60 px-3 py-2 text-xs font-medium text-cyan-900 transition-colors hover:bg-cyan-200/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 group-data-[collapsible=icon]:hidden dark:bg-cyan-900/60 dark:text-cyan-100 dark:hover:bg-cyan-800/70"
            aria-label="Usage approaching limit"
            title="Starting to reach plan limit"
            tabIndex={0}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
              <span>{Math.trunc(usagePercentage)}%</span>
              <span className="text-[11px] uppercase tracking-wide">Limit utilization</span>
            </div>
            <ArrowRight className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
          </Link>
        )}
        {usagePercentage >= 80 && usagePercentage < 100 && (
          <Link
            href="/subscription"
            className="mb-3 flex items-center justify-between gap-2 rounded-full bg-orange-100/70 px-3 py-2 text-xs font-semibold text-orange-800 transition-colors hover:bg-orange-200/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 group-data-[collapsible=icon]:hidden dark:bg-orange-900/70 dark:text-orange-200 dark:hover:bg-orange-800/70"
            aria-label="Usage warning"
            title="Almost reached your plan's limit"
            tabIndex={0}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500 dark:text-orange-300" />
              <span>{Math.trunc(usagePercentage)}%</span>
              <span className="text-[11px] uppercase tracking-wide">Limit utilization</span>
            </div>
            <ArrowRight className="h-4 w-4 text-orange-500 dark:text-orange-300" />
          </Link>
        )}
        {usagePercentage >= 100 && (
          <Link
            href="/subscription"
            className="mb-3 flex items-center justify-between gap-2 rounded-full bg-rose-100/70 px-3 py-2 text-xs font-bold text-rose-800 transition-colors hover:bg-rose-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 group-data-[collapsible=icon]:hidden dark:bg-rose-900/80 dark:text-rose-100 dark:hover:bg-rose-800"
            aria-label="Limit reached"
            title="Plan limit reached. Upgrade required."
            tabIndex={0}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-500 dark:text-rose-300" />
              <span>{Math.trunc(usagePercentage)}%</span>
              <span className="text-[11px] uppercase tracking-wide">Limit reached</span>
            </div>
            <ArrowRight className="h-4 w-4 text-rose-500 dark:text-rose-300" />
          </Link>
        )}
        <div className="rounded-xl bg-muted/40 px-3 py-2 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0">
          <NavUser />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
