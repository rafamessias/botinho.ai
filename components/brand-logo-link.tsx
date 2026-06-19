import Image from "next/image"

import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

type BrandLogoLinkProps = {
  className?: string
  width?: number
  height?: number
}

export const BrandLogoLink = ({
  className,
  width = 128,
  height = 48,
}: BrandLogoLinkProps) => (
  <Link
    href="/"
    aria-label="botinho.ai home"
    className={cn("flex items-center justify-center rounded-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary", className)}
  >
    <div className="relative" style={{ width, height }}>
      <Image
        src="/logo-green.png"
        alt="botinho.ai"
        fill
        className="object-contain dark:hidden"
        priority
      />
      <Image
        src="/logo-white.png"
        alt="botinho.ai"
        fill
        className="hidden object-contain dark:block"
        priority
      />
    </div>
  </Link>
)
