import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { SiteHeader } from '@/components/site-header';
import { Toaster } from '@/components/ui/toaster';
import { UserProvider } from '@/lib/user-context';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '开发博客 - 现代Web开发',
  description: '关于现代Web开发、React、Next.js等技术的博客',
  generator: 'v0.dev',
  icon: '/public/favicon.ico',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider>
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <footer className="border-t py-6 md:py-0">
                <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-16">
                  <p className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} 开发博客. 保留所有权利.
                  </p>
                  <div className="flex items-center gap-4">
                    <Link
                      href="/terms"
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      服务条款
                    </Link>
                    <Link
                      href="/privacy"
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      隐私政策
                    </Link>
                  </div>
                </div>
              </footer>
            </div>
          </UserProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
