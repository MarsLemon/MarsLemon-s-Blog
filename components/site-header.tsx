"use client"

import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { UserMenu } from "@/components/user-menu"
import { useUser } from "@/lib/user-context"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export function SiteHeader() {
  const { user, loading } = useUser()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between space-x-4 sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold">我的博客</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/blog" className="transition-colors hover:text-foreground/80 text-foreground/60">
              博客
            </Link>
            <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">
              关于
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <ModeToggle />
          {loading ? (
            <Skeleton className="h-8 w-20 rounded-md" />
          ) : user ? (
            <UserMenu />
          ) : (
            <Button asChild size="sm">
              <Link href="/login">登录</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
