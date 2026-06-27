import { BrandLogo } from "@/components/brand-logo"
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

type BrandLogoLinkProps = {
  className?: string
  height?: number
}

export const BrandLogoLink = ({
  className,
  height = 32,
}: BrandLogoLinkProps) => (
  <Link
    href="/"
    aria-label="botinho.ai home"
    className={cn("flex items-center justify-center rounded-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary", className)}
  >
    <div style={{ height }}>
      <BrandLogo className="h-full w-auto" priority />
    </div>
  </Link>
)
