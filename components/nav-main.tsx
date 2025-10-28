"use client"

import { IconStar, type TablerIcon } from "@tabler/icons-react"
import { usePathname, Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: TablerIcon
  }[]
}) {
  const pathname = usePathname()
  const t = useTranslations("NavMain")



  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">

        <SidebarMenu>
          {items.map((item) => {
            // Check if this item is selected based on the current pathname
            const isSelected =
              (item.url === "/" && (pathname === "/" || pathname.endsWith("/"))) ||
              (item.url !== "/" && pathname.includes(item.url))

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  size="lg"
                  className={`cursor-pointer transition-colors duration-200 ${isSelected
                    ? "bg-primary text-primary-foreground shadow-sm border-l-4 border-l-primary-foreground"
                    : "hover:bg-primary/5 hover:text-primary"
                    }`}
                >
                  <Link href={item.url} className="flex items-center gap-3 py-3">
                    {item.icon && <item.icon className="h-5 w-5" />}
                    <span className="text-base font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>

        {/* Feedback Survey Item */}
        <SidebarMenu className="mt-auto">
          <SidebarMenuItem>
            <SidebarMenuButton
              className="cursor-pointer [&:hover_.star-bounce]:animate-bounce [&:hover_.star-text-yellow]:text-yellow-400 [&:hover_.star-fill-yellow]:fill-yellow-400"
            >
              <IconStar className="h-5 w-5 star-bounce star-text-yellow star-fill-yellow" />
              <span>Rate our Service</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
