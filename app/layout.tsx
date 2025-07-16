import Link from "next/link"
import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from "@/components/site-header"
import { UserProvider } from "@/lib/user-context"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "DevBlog - Modern Web Development",
  description: "A blog about modern web development, React, Next.js, and more",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider>
            <div className="relative min-h-screen flex flex-col">
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <footer className="border-t py-6 md:py-0">
                <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-16">
                  <p className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} DevBlog. All rights reserved.
                  </p>
                  <div className="flex items-center gap-4">
                    <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                      Terms
                    </Link>
                    <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                      Privacy
                    </Link>
                  </div>
                </div>
              </footer>
            </div>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}


export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
