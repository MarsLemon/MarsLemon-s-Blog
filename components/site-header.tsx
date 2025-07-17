"use client"

import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { UserMenu } from "@/components/user-menu"
import { useUser } from "@/lib/user-context"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export function SiteHeader() {
  const { user, loading } = useUser()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/placeholder-logo.png" alt="Logo" className="h-6 w-6" />
            <span className="inline-block font-bold">MarsLemon's Blog</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/blog" className="transition-colors hover:text-primary">
              博客
            </Link>
            <Link href="/about" className="transition-colors hover:text-primary">
              关于
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-primary">
              隐私
            </Link>
            <Link href="/terms" className="transition-colors hover:text-primary">
              条款
            </Link>
            {user?.is_admin && (
              <Link href="/admin" className="transition-colors hover:text-primary">
                管理
              </Link>
            )}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <ModeToggle />
            {loading ? (
              <Button variant="ghost" size="icon" disabled>
                <Loader2 className="h-4 w-4 animate-spin" />
              </Button>
            ) : (
              <UserMenu />
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
