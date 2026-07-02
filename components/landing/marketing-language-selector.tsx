"use client"

import { Globe } from "lucide-react"

import { setLocalePreferenceAction } from "@/components/server-actions/user"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link, usePathname } from "@/i18n/navigation"
import { useLocale } from "next-intl"

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "pt-BR", name: "Português", flag: "🇧🇷" },
] as const

type LocaleCode = (typeof languages)[number]["code"]

type MarketingLanguageSelectorProps = {
  variant?: "default" | "compact"
}

const setClientLocaleCookies = (locale: LocaleCode) => {
  const secure = typeof window !== "undefined" && window.location.protocol === "https:" ? ";Secure" : ""
  document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000;SameSite=Lax${secure}`
  document.cookie = `user-language=${locale === "pt-BR" ? "pt_BR" : "en"};path=/;max-age=2592000;SameSite=Lax${secure}`
}

const handleLocaleSelect = (locale: LocaleCode) => {
  setClientLocaleCookies(locale)
  void setLocalePreferenceAction(locale)
}

export const MarketingLanguageSelector = ({ variant = "default" }: MarketingLanguageSelectorProps) => {
  const pathname = usePathname()
  const currentLocale = useLocale()
  const currentLanguage = languages.find((lang) => lang.code === currentLocale)

  const languageItems = languages.map((language) => (
    <DropdownMenuItem key={language.code} asChild className="cursor-pointer">
      <Link
        href={pathname}
        locale={language.code}
        onClick={() => handleLocaleSelect(language.code)}
        aria-current={currentLanguage?.code === language.code ? "true" : undefined}
      >
        <span className="mr-2">{language.flag}</span>
        <span>{language.name}</span>
        {currentLanguage?.code === language.code ? (
          <span className="ml-auto text-xs opacity-60">✓</span>
        ) : null}
      </Link>
    </DropdownMenuItem>
  ))

  if (variant === "compact") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Select language"
          >
            <Globe className="h-4 w-4 text-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="z-[60] min-w-[140px]">
          {languageItems}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="cursor-pointer">
          <Globe className="h-[1.2rem] w-[1.2rem] text-foreground" />
          <span className="sr-only">Select language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-[60]">
        {languageItems}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
