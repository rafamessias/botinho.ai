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

import { BrandLogo, BrandLogoIcon } from "@/components/brand-logo"
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
import { UsageBanner } from "@/components/ui/usage-banner"
import { Link } from "@/i18n/navigation"
import { useUser } from "@/components/user-provider"


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
      <SidebarHeader className="h-(--header-height) shrink-0 gap-0 px-1 py-0">
        <div className="flex h-full w-full items-center p-2">
          <SidebarMenu className="w-full">
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="botinho.ai"
                className="rounded-xl group-data-[collapsible=icon]:justify-center hover:bg-transparent hover:text-inherit active:bg-transparent active:text-inherit"
              >
                <Link href="/" aria-label="botinho.ai home" tabIndex={0}>
                  <BrandLogo
                    className="h-8 w-auto max-w-[135px] object-contain object-left group-data-[collapsible=icon]:hidden"
                    priority
                  />
                  <BrandLogoIcon
                    priority
                    className="hidden size-8 shrink-0 group-data-[collapsible=icon]:block"
                  />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-1">
        <NavMain groups={navGroups} />
      </SidebarContent>
      <SidebarFooter>
        {/* 
          More discrete and elegant usage alert. Uses a subtle icon and a small pill on the sidebar footer,
          with a minimal tooltip text and muted background. No border, gentle hover, uses appropriate color for context.
        */}
        {usagePercentage >= 65 && (
          <UsageBanner
            usagePercentage={usagePercentage}
            href="/subscription"
            ariaLabel={
              usagePercentage >= 100
                ? "Limit reached"
                : usagePercentage >= 80
                  ? "Usage warning"
                  : "Usage approaching limit"
            }
            title={
              usagePercentage >= 100
                ? "Plan limit reached. Upgrade required."
                : usagePercentage >= 80
                  ? "Almost reached your plan's limit"
                  : "Starting to reach plan limit"
            }
            percentageLabel={`${Math.trunc(usagePercentage)}%`}
            statusLabel={usagePercentage >= 100 ? "Limit reached" : "Limit utilization"}
          />
        )}
        <div className="rounded-xl bg-muted/40 px-3 py-2 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0">
          <NavUser />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
