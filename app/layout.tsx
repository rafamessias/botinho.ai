import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { ClerkProvider } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import Header from "@/components/header"
import { ptBR } from "@clerk/localizations"
import "./globals.css"

export const metadata = {
  title: "Obraguru",
  description: "Plataforma de gerenciamento de projetos de construção",
}

async function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const { userId } = await auth()

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="bg-background">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {userId && <Header />}
          <main className="min-h-screen max-w-[1280px] mx-auto">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider localization={ptBR}>
      <RootLayoutContent>{children}</RootLayoutContent>
    </ClerkProvider>
  )
}
