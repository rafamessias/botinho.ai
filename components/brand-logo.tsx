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
      height={81}
      priority={priority}
      className={cn("block h-auto w-auto dark:hidden", className)}
    />
    <Image
      src="/logo-white.png"
      alt="botinho.ai"
      width={420}
      height={79}
      priority={priority}
      className={cn("hidden h-auto w-auto dark:block", className)}
    />
  </>
)
