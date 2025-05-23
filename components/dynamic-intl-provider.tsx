"use client"

import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const NextIntlClientProvider = dynamic(
    () => import('next-intl').then(mod => mod.NextIntlClientProvider),
    {
        loading: () => (
            <div className="min-h-screen bg-background">
                <div className="flex items-center justify-center h-screen">
                    <div className="h-8 w-8 rounded-full bg-primary animate-pulse" />
                </div>
            </div>
        ),
        ssr: false
    }
);

export default function DynamicIntlProvider({ children }: { children: React.ReactNode }) {
    const params = useParams();
    const locale = params.locale as string;
    const [messages, setMessages] = useState<any>(null);

    useEffect(() => {
        const loadMessages = async () => {
            try {
                const module = await import(`@/i18n/messages/${locale}.json`);
                setMessages(module.default);
            } catch (error) {
                console.error('Failed to load messages:', error);
            }
        };

        loadMessages();
    }, [locale]);

    if (!messages) {
        return (
            <div className="min-h-screen bg-background">
                <div className="flex items-center justify-center h-screen">
                    <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
        </NextIntlClientProvider>
    );
} 