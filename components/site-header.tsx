"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { UserMenu } from "@/components/user-menu"
import { useUser } from "@/lib/user-context"

export function SiteHeader() {
  const { user } = useUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">开发博客</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className="transition-colors hover:text-foreground/80">
              首页
            </Link>
            <Link href="/blog" className="transition-colors hover:text-foreground/80">
              博客
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">{/* 搜索功能可以在这里添加 */}</div>
          <nav className="flex items-center space-x-2">
            <ModeToggle />
            {user ? (
              <UserMenu />
            ) : (
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin/login">登录</Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
