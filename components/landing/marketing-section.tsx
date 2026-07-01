import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type MarketingSectionProps = {
  id?: string
  variant?: "default" | "muted" | "surface"
  width?: "default" | "narrow"
  bordered?: boolean
  eyebrow?: string
  title?: string
  description?: string
  headerExtra?: ReactNode
  children?: ReactNode
  className?: string
}

const variantClasses = {
  default: "bg-background",
  muted: "section-alt bg-muted",
  surface: "section-surface bg-card",
} as const

const widthClasses = {
  default: "max-w-7xl",
  narrow: "max-w-5xl",
} as const

export const MarketingSection = ({
  id,
  variant = "default",
  width = "default",
  bordered = true,
  eyebrow,
  title,
  description,
  headerExtra,
  children,
  className,
}: MarketingSectionProps) => {
  const hasHeader = Boolean(eyebrow || title || description || headerExtra)

  return (
  <section
    id={id}
    className={cn(
      bordered && "border-t border-border",
      variantClasses[variant],
      className,
    )}
  >
    <div
      className={cn(
        "mx-auto w-full px-4 py-20 md:px-6 md:py-28",
        widthClasses[width],
      )}
    >
      {hasHeader ? (
        <div className="flex flex-col items-center gap-4 text-center">
          {eyebrow ? (
            <p className="text-xs font-medium uppercase tracking-wider text-primary">
              {eyebrow}
            </p>
          ) : null}
          {title ? (
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="max-w-3xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
              {description}
            </p>
          ) : null}
          {headerExtra}
        </div>
      ) : null}
      {children ? <div className={cn(hasHeader && "mt-16")}>{children}</div> : null}
    </div>
  </section>
  )
}
