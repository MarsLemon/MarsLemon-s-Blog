import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from "@/components/site-header"
import { Toaster } from "@/components/ui/toaster"
import { UserProvider } from "@/lib/user-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MarsLemon's Blog",
  description: "A blog platform for sharing technical articles and development experiences.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <UserProvider>
            <div className="flex min-h-screen flex-col">
              <SiteHeader />
              <main className="flex-1">{children}</main>
            </div>
          </UserProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
