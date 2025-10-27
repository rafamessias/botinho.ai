"use client"

import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconSettings,
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
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { logoutAction } from "@/components/server-actions/auth"
import { useState } from "react"
import { useUser } from "@/components/user-provider"
import { useSession } from "next-auth/react"

export function NavUser() {
  const locale = useLocale()
  const t = useTranslations("NavUser")
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { user, loading, setUser } = useUser()
  const { update } = useSession()

  // Show loading state if user data is still loading
  if (loading || !user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="cursor-pointer">
            <div className="h-8 w-8 rounded-lg bg-gray-200 animate-pulse" />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-1" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  const menuItems = [
    {
      label: t("account"),
      icon: IconUserCircle,
      href: `/${locale}/account`,
    },
    {
      label: t("subscription"),
      icon: IconCreditCard,
      href: `/${locale}/subscription`,
    }
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
      await logoutAction(`/${locale}/sign-in`)
      await update()
      // NextAuth will handle the redirect after logout
    } catch (error) {
      // NextAuth throws NEXT_REDIRECT for logout redirects - this is expected
      if (error instanceof Error && error.message === "NEXT_REDIRECT") {
        // Don't show error for redirects - this is normal logout flow
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
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
            >
              <Avatar className="h-8 w-8 rounded-lg ">
                <AvatarImage src={user.avatarUrl || ""} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {user.firstName?.charAt(0) || ""}{user.lastName?.charAt(0) || ""}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{truncatedName}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {truncatedEmail}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
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
