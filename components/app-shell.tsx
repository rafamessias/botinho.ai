import type { CSSProperties, ReactNode } from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const shellStyle = {
  "--sidebar-width": "calc(var(--spacing) * 72)",
  "--header-height": "calc(var(--spacing) * 12)",
} as CSSProperties

type AppShellProps = {
  title?: string
  header?: ReactNode
  description?: ReactNode
  children: ReactNode
  variant?: "default" | "fullBleed"
  insetClassName?: string
  contentClassName?: string
}

export const AppShell = ({
  title,
  header,
  description,
  children,
  variant = "default",
  insetClassName,
  contentClassName,
}: AppShellProps) => {
  if (variant === "fullBleed") {
    return (
      <SidebarProvider style={shellStyle} className="app-shell min-h-svh">
        <AppSidebar variant="inset" />
        <SidebarInset
          className={cn(
            "flex flex-col overflow-hidden bg-background !pb-0",
            insetClassName,
          )}
        >
          <SiteHeader title={title} />
          <div className="flex min-w-0 w-full flex-1 overflow-hidden">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider style={shellStyle} className="app-shell min-h-svh">
      <AppSidebar variant="inset" />
      <SidebarInset className={cn("bg-background", insetClassName)}>
        <SiteHeader title={title} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main mx-auto flex w-full max-w-7xl flex-1 flex-col">
            <div className={cn("app-page-content", contentClassName)}>
              {header ? (
                header
              ) : description ? (
                <div className="space-y-1">
                  {typeof description === "string" ? (
                    <p className="text-sm text-muted-foreground sm:text-base">{description}</p>
                  ) : (
                    description
                  )}
                </div>
              ) : null}
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
