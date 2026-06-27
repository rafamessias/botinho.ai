"use client"

import { useTranslations, useLocale } from "next-intl"
import { Globe } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { updateUserLanguageAction } from "@/components/server-actions/user"
import { useRouter, usePathname } from "@/i18n/navigation"

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
}

export function LanguageSelector({ variant = "default" }: LanguageSelectorProps) {
    const t = useTranslations("Settings")
    const pathname = usePathname()
    const router = useRouter()

    const currentLocale = useLocale()
    const currentLanguage = languages.find(lang => lang.code === currentLocale)

    const handleLanguageChange = async (newLanguage: string) => {
        try {
            const result = await updateUserLanguageAction(newLanguage as "en" | "pt-BR")

            if (!result?.success) {
                toast.error(result?.error || "Failed to update language")
                return
            }

            const updatedLocale = result.locale ?? newLanguage
            router.replace(pathname, { locale: updatedLocale })
        } catch (error) {
            console.error("Language update error:", error)
            toast.error("Unexpected error while changing language")
        }
    }

    // Compact variant - icon only
    if (variant === "compact") {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-muted hover:text-foreground transition-colors"
                    >
                        <Globe className="h-4 w-4 text-foreground" />
                        <span className="sr-only">Select language</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[140px]">
                    {languages.map((language) => (
                        <DropdownMenuItem
                            key={language.code}
                            onClick={() => handleLanguageChange(language.code)}
                            className="cursor-pointer"
                        >
                            <span className="mr-2">{language.flag}</span>
                            <span>{language.name}</span>
                            {currentLanguage?.code === language.code && (
                                <span className="ml-auto text-xs opacity-60">✓</span>
                            )}
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
                        <Globe className="h-[1.2rem] w-[1.2rem] text-foreground" />
                        <span className="sr-only">Select language</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {languages.map((language) => (
                        <DropdownMenuItem
                            key={language.code}
                            onClick={() => handleLanguageChange(language.code)}
                            className="cursor-pointer"
                        >
                            <span className="mr-2">{language.flag}</span>
                            <span>{language.name}</span>
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
