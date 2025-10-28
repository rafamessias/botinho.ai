import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import AuthSessionProvider from '@/components/session-provider'
import { UserProvider } from '@/components/user-provider'
import { Analytics } from "@vercel/analytics/next"
import '@/app/globals.css'

export const metadata: Metadata = {
    title: "botinho.ai - WhatsApp AI Automation",
    description: "Automate your WhatsApp customer support with AI. Get started with a free trial.",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html suppressHydrationWarning>
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            try {
                                var theme = localStorage.getItem('theme') || 'system';
                                var isDark = false;
                                
                                if (theme === 'dark') {
                                    isDark = true;
                                } else if (theme === 'system') {
                                    isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                                }
                                
                                if (isDark) {
                                    document.documentElement.classList.add('dark');
                                } else {
                                    document.documentElement.classList.remove('dark');
                                }
                            } catch (_) {}
                        `,
                    }}
                />
            </head>
            <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <AuthSessionProvider>
                        <UserProvider>
                            {children}
                        </UserProvider>
                        <Toaster />
                    </AuthSessionProvider>
                </ThemeProvider>
                <Analytics />
            </body>
        </html>
    )
}
