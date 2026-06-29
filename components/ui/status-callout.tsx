import type { ReactNode } from "react"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

import { cn } from "@/lib/utils"

type StatusCalloutVariant = "warning" | "info" | "success" | "destructive"

const variantClasses: Record<
  StatusCalloutVariant,
  { container: string; icon: string; message: string; link?: string }
> = {
  warning: {
    container: "border-warning/30 bg-warning/10",
    icon: "text-warning",
    message: "text-foreground",
    link: "text-warning hover:text-warning/80",
  },
  info: {
    container: "border-info/30 bg-info/10",
    icon: "text-info",
    message: "text-foreground",
    link: "text-info hover:text-info/80",
  },
  success: {
    container: "border-success/30 bg-success/10",
    icon: "text-success",
    message: "text-foreground",
  },
  destructive: {
    container: "border-destructive/30 bg-destructive/10",
    icon: "text-destructive",
    message: "text-foreground",
  },
}

type StatusCalloutProps = {
  variant?: StatusCalloutVariant
  message: ReactNode
  linkHref?: string
  linkLabel?: string
  className?: string
}

export function StatusCallout({
  variant = "warning",
  message,
  linkHref,
  linkLabel,
  className,
}: StatusCalloutProps) {
  const styles = variantClasses[variant]

  return (
    <div
      role="alert"
      className={cn(
        "flex shrink-0 items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs",
        styles.container,
        className,
      )}
    >
      <AlertTriangle className={cn("size-3.5 shrink-0", styles.icon)} aria-hidden="true" />
      <span className={styles.message}>
        {message}
        {linkHref && linkLabel ? (
          <>
            {" "}
            <Link
              href={linkHref}
              className={cn("font-medium underline underline-offset-2", styles.link)}
            >
              {linkLabel}
            </Link>
          </>
        ) : null}
      </span>
    </div>
  )
}
