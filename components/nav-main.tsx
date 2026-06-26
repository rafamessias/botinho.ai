"use client"

import { type TablerIcon } from "@tabler/icons-react"
import { usePathname, Link } from "@/i18n/navigation"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

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

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-1">
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
                  className={cn(
                    "group cursor-pointer rounded-xl px-1 py-[6px] transition-all",
                    isSelected
                      ? "bg-primary/15 text-primary shadow-sm hover:bg-primary/20"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  <Link
                    href={item.url}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    tabIndex={0}
                    aria-label={item.title}
                  >
                    {item.icon && (
                      <item.icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                    )}
                    <span className="text-sm font-medium tracking-tight">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
