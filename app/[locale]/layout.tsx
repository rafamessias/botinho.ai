import { Inter } from 'next/font/google';
import { routing } from '@/i18n/routing';
import { hasLocale } from 'next-intl'
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/header';
import DynamicIntlProvider from "@/components/dynamic-intl-provider"
import '@/app/globals.css';
import { notFound } from 'next/navigation';
import { Toaster } from '@/components/ui/sonner';
import { UserProvider } from '@/components/UserProvider';
import { LoadingProvider } from '@/components/LoadingProvider';
import { TopProgress } from '@/components/RouteLoading';
import PWAInstallPrompt from '@/components/pwa-install-prompt';
import AuthSessionProvider from '@/components/providers/session-provider';

const inter = Inter({
    subsets: ["latin"],
    display: 'swap',
    preload: true,
    variable: '--font-inter',
    weight: ['400', '500', '600', '700'],
})

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const title = "Obraguru";
    const description = "Obraguru - RDO";

    return {
        title: {
            default: title,
        },
        description: description,
        icons: {
            icon: '/favicon.ico',
            apple: '/apple-touch-icon.png',
        },
        manifest: '/site.webmanifest',
        appleWebApp: {
            capable: true,
            statusBarStyle: 'default',
            title: title,
        },
        openGraph: {
            title: title,
        },
        other: {
            'apple-mobile-web-app-capable': 'yes',
            'apple-mobile-web-app-status-bar-style': 'default',
            'apple-mobile-web-app-title': title,
            'mobile-web-app-capable': 'yes',
            'application-name': title,
            'msapplication-TileColor': '#000000',
            'msapplication-config': '/browserconfig.xml',
        }
    }
}

export async function generateViewport({ params }: { params: Promise<{ locale: string }> }) {
    return {
        themeColor: '#000000',
        viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
    }
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}

export default async function RootLayout({
    children,
    params
}: {
    children: React.ReactNode
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params;
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }


    return (
        <html lang={locale} suppressHydrationWarning={true}>
            <body className={`${inter.className} bg-background relative`} suppressHydrationWarning={true}>
                <DynamicIntlProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="light"
                        enableSystem
                        disableTransitionOnChange
                        storageKey="obraguru-theme"
                    >
                        <LoadingProvider>
                            <AuthSessionProvider>
                                <UserProvider>
                                    <TopProgress />
                                    <main className="w-full">
                                        <Header />
                                        {children}
                                    </main>
                                    <Toaster richColors closeButton />
                                    <PWAInstallPrompt />
                                </UserProvider>
                            </AuthSessionProvider>
                        </LoadingProvider>
                    </ThemeProvider>
                </DynamicIntlProvider>
            </body>
        </html>
    );
} 