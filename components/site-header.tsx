import { BrandLogoLink } from "@/components/brand-logo-link"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeSelector } from "@/components/theme-selector"
import { LanguageSelector } from "@/components/language-selector"

export function SiteHeader({ title }: { title?: string }) {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1 cursor-pointer" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="md:hidden" aria-hidden="true">
          <BrandLogoLink
            height={28}
            logoClassName="max-w-[112px] object-contain object-left"
          />
        </div>
        <h1 className="text-base font-medium">
          <span className="sr-only md:hidden">{title}</span>
          <span className="hidden md:inline">{title}</span>
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <ThemeSelector variant="compact" />
          <LanguageSelector variant="compact" />
        </div>
      </div>
    </header>
  )
}
