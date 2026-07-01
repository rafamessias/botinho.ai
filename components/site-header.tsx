import { BrandLogoIcon } from "@/components/brand-logo"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeSelector } from "@/components/theme-selector"
import { LanguageSelector } from "@/components/language-selector"
import { Link } from "@/i18n/navigation"

export function SiteHeader({ title }: { title?: string }) {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b border-border bg-background/95 backdrop-blur-md transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex h-full w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1 cursor-pointer" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="flex h-full min-w-0 items-center gap-2">
          {title ? (
            <div className="flex min-w-0 items-center gap-1.5">
              <Link
                href="/"
                aria-label="botinho.ai home"
                className="flex shrink-0 items-center justify-center rounded-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary md:hidden"
              >
                <BrandLogoIcon priority className="size-7 -translate-y-0.5" />
              </Link>
              <h1 className="m-0 min-w-0 truncate text-base font-medium leading-none translate-y-0.5 md:translate-y-0">
                {title}
              </h1>
            </div>
          ) : (
            <Link
              href="/"
              aria-label="botinho.ai home"
              className="flex shrink-0 items-center justify-center rounded-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary md:hidden"
            >
              <BrandLogoIcon priority className="size-7" />
            </Link>
          )}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <ThemeSelector variant="compact" />
          <LanguageSelector variant="compact" />
        </div>
      </div>
    </header>
  )
}
