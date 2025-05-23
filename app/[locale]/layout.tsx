import { Inter } from 'next/font/google';
import { routing } from '@/i18n/routing';
import { hasLocale } from 'next-intl'
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/header';
import DynamicIntlProvider from "@/components/dynamic-intl-provider"
import '@/app/globals.css';
import { notFound } from 'next/navigation';

const inter = Inter({
    subsets: ["latin"],
    display: 'swap',
    preload: true,
    variable: '--font-inter',
    weight: ['400', '500', '600', '700'],
})

export async function generateMetadata({ params }: { params: { locale: string } }) {
    const title = "Obraguru";
    const description = "Obraguru - RDO";

    return {
        title: {
            default: title,
        },
        description: description,
        icons: {
            icon: '/favicon.ico',
        },
        openGraph: {
            title: title,

        }
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
    params: { locale: string }
}) {
    const { locale } = await params;
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    return (
        <html lang={locale} suppressHydrationWarning>
            <body className={`${inter.className} bg-background`}>
                <DynamicIntlProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="light"
                        enableSystem
                        disableTransitionOnChange
                        storageKey="obraguru-theme"
                    >
                        <Header />
                        <div className="container max-w-[1280px] flex-1 mx-auto w-full p-6">
                            {children}
                        </div>
                    </ThemeProvider>
                </DynamicIntlProvider>
            </body>
        </html>
    );
} 