"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { useParams, usePathname, useSearchParams } from "next/navigation"
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

interface LanguageSelectorProps {
    variant?: "default" | "compact"
    currentPath?: string
}

export function LanguageSelector({ variant = "default", currentPath }: LanguageSelectorProps) {
    const t = useTranslations("Settings")
    const params = useParams()
    const searchParams = useSearchParams()
    const currentLocale = params.locale as string
    const currentLanguage = languages.find(lang => lang.code === currentLocale)
    const pathname = usePathname()

    // Remove current locale from pathname if present (for proper locale switching)
    const pathnameWithoutLocale = React.useMemo(() => {
        if (currentPath) return currentPath

        // If pathname starts with locale, remove it
        if (pathname.startsWith(`/${currentLocale}`)) {
            return pathname.slice(`/${currentLocale}`.length) || "/"
        }
        return pathname
    }, [pathname, currentLocale, currentPath])

    // Handle search parameters and update redirect parameter locale if needed
    const updatedSearchParams = React.useMemo(() => {
        const params = new URLSearchParams(searchParams.toString())

        // If there's a redirect parameter, update its locale
        const redirect = params.get('redirect')
        if (redirect) {
            // Remove locale from redirect URL and let the Link component handle the new locale
            let updatedRedirect = redirect
            if (redirect.startsWith(`/${currentLocale}`)) {
                updatedRedirect = redirect.slice(`/${currentLocale}`.length) || "/"
            }
            // Ensure the redirect path starts with a slash
            if (!updatedRedirect.startsWith('/')) {
                updatedRedirect = '/' + updatedRedirect
            }
            params.set('redirect', updatedRedirect)
        }

        return params
    }, [searchParams, currentLocale])

    const search = updatedSearchParams.toString() ? `?${updatedSearchParams.toString()}` : ""
    const targetPath = pathnameWithoutLocale + search

    // Compact variant - icon only
    if (variant === "compact") {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-muted/50 transition-colors"
                    >
                        <Globe className="h-4 w-4" />
                        <span className="sr-only">Select language</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[140px]">
                    {languages.map((language) => (
                        <DropdownMenuItem key={language.code} asChild>
                            <Link
                                href={targetPath}
                                locale={language.code}
                                className="cursor-pointer flex items-center w-full"
                            >
                                <span className="mr-2">{language.flag}</span>
                                <span>{language.name}</span>
                                {currentLanguage?.code === language.code && (
                                    <span className="ml-auto text-xs opacity-60">✓</span>
                                )}
                            </Link>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }

    // Default variant - with description
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
                            <Link href={targetPath} locale={language.code}>
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
