import Image from "next/image"

import { cn } from "@/lib/utils"

type BrandLogoProps = {
  className?: string
  priority?: boolean
}

export const BrandLogo = ({
  className,
  priority = false,
}: BrandLogoProps) => (
  <>
    <Image
      src="/logo-green.png"
      alt="botinho.ai"
      width={420}
      height={96}
      priority={priority}
      className={cn("block h-auto w-auto dark:hidden", className)}
    />
    <Image
      src="/logo-white.png"
      alt="botinho.ai"
      width={420}
      height={96}
      priority={priority}
      className={cn("hidden h-auto w-auto dark:block", className)}
    />
  </>
)

export const BrandLogoIcon = ({
  className,
  priority = false,
}: BrandLogoProps) => (
  <span className={cn("relative inline-flex size-8 shrink-0 items-center justify-center", className)}>
    <Image
      src="/bot-icon-green.png"
      alt="botinho.ai"
      width={64}
      height={64}
      priority={priority}
      className="size-full object-contain dark:hidden"
    />
    <Image
      src="/bot-icon-white.png"
      alt="botinho.ai"
      width={64}
      height={64}
      priority={priority}
      className="hidden size-full object-contain dark:block"
    />
  </span>
)
