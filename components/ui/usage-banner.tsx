import Link from "next/link"
import { AlertTriangle, ArrowRight } from "lucide-react"

import {
  getUsageBannerLevel,
  usageBannerClasses,
  type UsageBannerLevel,
} from "@/lib/theme"
import { cn } from "@/lib/utils"

type UsageBannerProps = {
  usagePercentage: number
  href: string
  ariaLabel: string
  title: string
  percentageLabel: string
  statusLabel: string
  className?: string
}

function UsageBannerLink({
  level,
  href,
  ariaLabel,
  title,
  percentageLabel,
  statusLabel,
  className,
}: UsageBannerProps & { level: UsageBannerLevel }) {
  const styles = usageBannerClasses[level]

  return (
    <Link
      href={href}
      className={cn(
        "mb-3 flex items-center justify-between gap-2 rounded-full px-3 py-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 group-data-[collapsible=icon]:hidden",
        styles.container,
        level === "warning" && "font-semibold",
        level === "critical" && "font-bold",
        className,
      )}
      aria-label={ariaLabel}
      title={title}
      tabIndex={0}
    >
      <div className="flex items-center gap-2">
        <AlertTriangle className={cn("h-4 w-4", styles.icon)} />
        <span>{percentageLabel}</span>
        <span className="text-[11px] uppercase tracking-wide">{statusLabel}</span>
      </div>
      <ArrowRight className={cn("h-4 w-4", styles.icon)} />
    </Link>
  )
}

export function UsageBanner(props: UsageBannerProps) {
  const level = getUsageBannerLevel(props.usagePercentage)
  if (!level) return null
  return <UsageBannerLink level={level} {...props} />
}
