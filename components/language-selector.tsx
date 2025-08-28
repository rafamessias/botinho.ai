"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { useParams, useRouter } from "next/navigation"
import { Link } from "@/i18n/navigation"
import { Globe } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const languages = [
    {
        code: "en",
        name: "English",
        flag: "🇺🇸"
    },
    {
        code: "pt-BR",
        name: "Português",
        flag: "🇧🇷"
    }
]

export function LanguageSelector() {
    const t = useTranslations("Settings")
    const params = useParams()
    const currentLocale = params.locale as string
    const currentLanguage = languages.find(lang => lang.code === currentLocale)

    return (
        <div className="flex items-center space-x-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="cursor-pointer">
                        <Globe className="h-[1.2rem] w-[1.2rem]" />
                        <span className="sr-only">Select language</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {languages.map((language) => (
                        <DropdownMenuItem key={language.code} asChild>
                            <Link href="/" locale={language.code}>
                                <span className="mr-2">{language.flag}</span>
                                <span>{language.name}</span>
                            </Link>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
            <div className="ml-4">
                <p className="text-sm font-medium">
                    {currentLanguage?.flag} {currentLanguage?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                    {t("language.description")}
                </p>
            </div>
        </div>
    )
}
