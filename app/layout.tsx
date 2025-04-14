import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import "./globals.css"

export const metadata = {
  title: "Obraguru",
  description: "Plataforma de gerenciamento de projetos de construção",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="bg-background">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Header />
          <main className="min-h-screen max-w-[1280px] mx-auto">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
