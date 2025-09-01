"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { useTranslations } from "next-intl"
import { Moon, Sun, Monitor } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { updateUserThemeAction } from "@/components/server-actions/user"

interface ThemeSelectorProps {
    variant?: "default" | "compact"
}

export function ThemeSelector({ variant = "default" }: ThemeSelectorProps) {
    const { theme, setTheme } = useTheme()
    const t = useTranslations("Settings")
    const [mounted, setMounted] = React.useState(false)

    // Prevent hydration mismatch by only rendering theme-dependent content after mount
    React.useEffect(() => {
        setMounted(true)
    }, [])

    const handleThemeChange = async (newTheme: "light" | "dark" | "system") => {
        try {
            // Update theme in next-themes (for immediate UI update)
            setTheme(newTheme)
            // Update theme in user record
            await updateUserThemeAction(newTheme)

        } catch (error) {
            //Avoid returning error to the client
            console.error("Theme update error:", error)
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
                        className="h-8 w-8 hover:bg-muted/50 transition-colors"
                    >
                        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[120px]">
                    <DropdownMenuItem onClick={() => handleThemeChange("light")} className="cursor-pointer">
                        <Sun className="mr-2 h-4 w-4" />
                        <span>Light</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleThemeChange("dark")} className="cursor-pointer">
                        <Moon className="mr-2 h-4 w-4" />
                        <span>Dark</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleThemeChange("system")} className="cursor-pointer">
                        <Monitor className="mr-2 h-4 w-4" />
                        <span>System</span>
                    </DropdownMenuItem>
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
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleThemeChange("light")}>
                        <Sun className="mr-2 h-4 w-4" />
                        <span>{t("theme.light")}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
                        <Moon className="mr-2 h-4 w-4" />
                        <span>{t("theme.dark")}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleThemeChange("system")}>
                        <Monitor className="mr-2 h-4 w-4" />
                        <span>{t("theme.system")}</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <div className="ml-4">
                <p className="text-sm font-medium">
                    {mounted && theme === "light" && t("theme.light")}
                    {mounted && theme === "dark" && t("theme.dark")}
                    {mounted && theme === "system" && t("theme.system")}
                    {!mounted && t("theme.system")}
                </p>
                <p className="text-xs text-muted-foreground">
                    {t("theme.description")}
                </p>
            </div>
        </div>
    )
}
