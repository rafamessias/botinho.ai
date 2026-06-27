"use client"

import {
  IconDotsVertical,
  IconLogout,
  IconUserCircle,
} from "@tabler/icons-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { logoutAction } from "@/components/server-actions/auth"
import { useState } from "react"
import { useUser } from "@/components/user-provider"

export function NavUser() {
  const t = useTranslations("NavUser")
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { user, loading, setUser } = useUser()

  // Show loading state if user data is still loading
  if (loading || !user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="cursor-pointer">
            <div className="h-8 w-8 rounded-lg bg-muted animate-pulse" />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <div className="h-4 bg-muted rounded animate-pulse mb-1" />
              <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  const menuItems = [
    {
      label: t("profile"),
      icon: IconUserCircle,
      href: "/account",
    },
  ]

  // Helper to truncate string to max 20 chars, adding ... if longer
  const truncateText = (text: string, maxLength: number = 20): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + "...";
  };

  const truncatedName = truncateText(user.name, 22);
  const truncatedEmail = truncateText(user.email, 22);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      setUser(null)
      await logoutAction("/sign-in")
    } catch (error) {
      if (error instanceof Error && error.message === "NEXT_REDIRECT") {
        return
      }
      console.error("Logout error:", error)
      setIsLoggingOut(false)
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              tooltip={truncatedName}
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer group-data-[collapsible=icon]:justify-center"
            >
              <Avatar className="h-8 w-8 shrink-0 rounded-lg">
                <AvatarImage src={user.avatarUrl || ""} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {user.firstName?.charAt(0) || ""}{user.lastName?.charAt(0) || ""}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-medium">{truncatedName}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {truncatedEmail}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={"bottom"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              {menuItems.map((item) => (
                <DropdownMenuItem
                  key={item.label}
                  onSelect={() => {
                    router.push(item.href);
                  }}
                >
                  <item.icon className="hover:text-accent" />
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onSelect={handleLogout}
              disabled={isLoggingOut}
              className="cursor-pointer"
            >
              <IconLogout className="hover:text-accent" />
              {isLoggingOut ? t("loggingOut") : t("logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
