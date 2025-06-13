'use client';

import { Switch } from "@/components/ui/switch";
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

interface LanguageSwitchProps {
    className?: string;
    disabled?: boolean;
}

export function LanguageSwitch({ className, disabled }: LanguageSwitchProps) {
    const router = useRouter();
    const locale = useLocale();
    const isEnglish = locale === 'en';

    const handleLanguageChange = (checked: boolean) => {
        const newLocale = checked ? 'en' : 'pt-BR';
        // Get the current path without the locale prefix
        const path = window.location.pathname.replace(`/${locale}`, '');
        // Navigate to the same path with the new locale
        router.push(`/${newLocale}${path}`);
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <span className={`text-lg ${!isEnglish ? 'opacity-100' : 'opacity-50'}`}>🇧🇷</span>
            <Switch
                checked={isEnglish}
                onCheckedChange={handleLanguageChange}
                disabled={disabled}
            />
            <span className={`text-lg ${isEnglish ? 'opacity-100' : 'opacity-50'}`}>🇺🇸</span>
        </div>
    );
} 