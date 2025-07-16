import Link from "next/link"
import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from "@/components/site-header"
import { UserProvider } from "@/lib/user-context"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "开发博客 - 现代Web开发",
  description: "关于现代Web开发、React、Next.js等技术的博客",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <UserProvider>
            <div className="relative min-h-screen flex flex-col">
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <footer className="border-t py-6 md:py-0">
                <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-16">
                  <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} 开发博客. 保留所有权利.</p>
                  <div className="flex items-center gap-4">
                    <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                      服务条款
                    </Link>
                    <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                      隐私政策
                    </Link>
                  </div>
                </div>
              </footer>
            </div>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
