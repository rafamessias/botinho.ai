"use client"

import { type TablerIcon } from "@tabler/icons-react"
import { usePathname, Link } from "@/i18n/navigation"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

type NavItem = {
  title: string
  url: string
  icon?: TablerIcon
}

type NavGroup = {
  label?: string
  items: NavItem[]
}

function NavMenuItems({ items }: { items: NavItem[] }) {
  const pathname = usePathname()

  return (
    <SidebarMenu>
      {items.map((item) => {
        const isSelected =
          (item.url === "/" && (pathname === "/" || pathname.endsWith("/"))) ||
          (item.url !== "/" && pathname.includes(item.url))

        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              tooltip={item.title}
              className={cn(
                "cursor-pointer rounded-xl transition-all group-data-[collapsible=icon]:justify-center",
                isSelected
                  ? "bg-primary/15 text-primary shadow-sm hover:bg-primary/20"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              <Link
                href={item.url}
                tabIndex={0}
                aria-label={item.title}
              >
                {item.icon && (
                  <item.icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors group-hover/menu-item:text-primary",
                      isSelected ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                )}
                <span className="text-sm font-medium tracking-tight group-data-[collapsible=icon]:hidden">
                  {item.title}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}

export function NavMain({ groups }: { groups: NavGroup[] }) {
  return (
    <>
      {groups.map((group) => (
        <SidebarGroup key={group.label ?? group.items[0]?.title}>
          {group.label && (
            <SidebarGroupLabel className="px-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {group.label}
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent className="flex flex-col gap-1">
            <NavMenuItems items={group.items} />
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  )
}
