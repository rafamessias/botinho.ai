/**
 * Central theme interaction patterns.
 * Use these instead of ad-hoc hover/color classes in feature components.
 */
export const themeInteraction = {
  /** List rows, icon buttons on muted surfaces */
  mutedHover:
    "hover:bg-muted hover:text-foreground dark:hover:bg-muted/50",
  /** Ghost icon buttons that should not show a hover background */
  ghostIconHover:
    "hover:bg-transparent hover:text-foreground dark:hover:bg-transparent dark:hover:text-foreground",
  /** Destructive menu/button actions */
  destructiveHover:
    "text-destructive hover:bg-destructive/10 hover:text-destructive dark:hover:bg-destructive/15",
  /** Primary text links */
  primaryLink: "text-primary hover:underline",
  /** Form validation */
  formError: "text-destructive text-sm",
  formErrorBorder: "border-destructive",
} as const

export type UsageBannerLevel = "info" | "warning" | "critical"

export const usageBannerClasses: Record<
  UsageBannerLevel,
  { container: string; icon: string }
> = {
  info: {
    container:
      "bg-info/15 text-info-foreground hover:bg-info/25 focus-visible:ring-info/50",
    icon: "text-info",
  },
  warning: {
    container:
      "bg-warning/15 text-warning-foreground hover:bg-warning/25 focus-visible:ring-warning/50",
    icon: "text-warning",
  },
  critical: {
    container:
      "bg-critical/15 text-critical-foreground hover:bg-critical/25 focus-visible:ring-critical/50",
    icon: "text-critical",
  },
}

export function getUsageBannerLevel(usagePercentage: number): UsageBannerLevel | null {
  if (usagePercentage >= 100) return "critical"
  if (usagePercentage >= 80) return "warning"
  if (usagePercentage >= 65) return "info"
  return null
}
