import type { Metadata } from "next"
import { routing } from "@/i18n/routing"

const baseUrl = "https://botinho.ai"

export default function sitemap() {
  const lastModified = new Date()

  const staticPaths = ["", "/terms", "/privacy", "/sign-in", "/sign-up"]

  return routing.locales.flatMap((locale) =>
    staticPaths.map((path) => ({
      url: `${baseUrl}/${locale}${path}`,
      lastModified,
      changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : 0.6,
    })),
  )
}
