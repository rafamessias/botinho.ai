'use client';

import { Switch } from "@/components/ui/switch";
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { fetchContentApi } from "./actions/fetch-content-api";
import { toast } from 'sonner';

interface LanguageSwitchProps {
    className?: string;
    disabled?: boolean;
    userId?: string;
}

export function LanguageSwitch({ className, disabled, userId }: LanguageSwitchProps) {
    const router = useRouter();
    const locale = useLocale();
    const isEnglish = locale === 'en';

    const handleLanguageChange = async (checked: boolean) => {
        const newLocale = checked ? 'en' : 'pt-BR';
        // Get the current path without the locale prefix
        const path = window.location.pathname.replace(`/${locale}`, '');

        // Update user language in the database only if userId is provided
        if (userId) {
            try {
                const response = await fetchContentApi(`users/${userId}`, {
                    method: 'PUT',
                    body: { language: newLocale },
                    revalidateTag: ['me']
                });

                if (!response.success || response.error) {
                    console.error('Failed to update user language:', response.error);
                    toast.error(response.error);
                    return;
                }

                toast.success('Language updated successfully');

            } catch (error) {
                console.error('Error updating user language:', error);
                toast.error(error as string);
                return;
            }
        }

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