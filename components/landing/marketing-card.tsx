import type { ReactNode } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const marketingCardVariants = cva("flex flex-col rounded-xl", {
  variants: {
    variant: {
      flat: "border border-border bg-card",
      elevated: "border border-border bg-card shadow-sm",
      highlight: "bg-primary text-primary-foreground",
    },
  },
  defaultVariants: {
    variant: "flat",
  },
})

type MarketingCardProps = VariantProps<typeof marketingCardVariants> & {
  className?: string
  children: ReactNode
}

export const MarketingCard = ({
  variant,
  className,
  children,
}: MarketingCardProps) => (
  <div className={cn(marketingCardVariants({ variant }), className)}>
    {children}
  </div>
)

export const MarketingCardHeader = ({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) => (
  <div className={cn("flex flex-col gap-3 p-6", className)}>{children}</div>
)

export const MarketingCardTitle = ({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) => (
  <h3 className={cn("text-lg font-semibold leading-none", className)}>
    {children}
  </h3>
)

export const MarketingCardDescription = ({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) => (
  <p
    className={cn(
      "text-sm leading-relaxed text-muted-foreground",
      className,
    )}
  >
    {children}
  </p>
)

export const MarketingCardContent = ({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) => (
  <div className={cn("px-6 pb-6 text-sm leading-relaxed text-muted-foreground", className)}>
    {children}
  </div>
)

export const MarketingCardIcon = ({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) => (
  <span
    className={cn(
      "flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary",
      className,
    )}
  >
    {children}
  </span>
)
