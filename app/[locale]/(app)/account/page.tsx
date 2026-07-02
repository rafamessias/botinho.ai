"use client"

import { useTranslations } from "next-intl"
import { AppShell } from "@/components/app-shell"
import { ProfileForm } from "@/components/account/profile-form"

export default function AccountPage() {
  const t = useTranslations("Profile")

  return (
    <AppShell title={t("title")} description={t("description")}>
      <ProfileForm />
    </AppShell>
  )
}
