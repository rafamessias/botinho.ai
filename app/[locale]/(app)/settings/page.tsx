"use client"

import { useTranslations } from "next-intl"
import { AppShell } from "@/components/app-shell"
import Settings from "@/components/settings/settings-page"

export default function SettingsPage() {
  const t = useTranslations("Settings")

  return (
    <AppShell title={t("title")} description={t("description")}>
      <Settings />
    </AppShell>
  )
}
