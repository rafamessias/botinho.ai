"use client"

import { useTranslations } from "next-intl"
import { AppShell } from "@/components/app-shell"
import ContactSection from "@/components/support/contact-section"

export default function SupportPage() {
  const t = useTranslations("Support")

  return (
    <AppShell title={t("title")} description={t("description")}>
      <div className="grid gap-6">
        <ContactSection />
      </div>
    </AppShell>
  )
}
