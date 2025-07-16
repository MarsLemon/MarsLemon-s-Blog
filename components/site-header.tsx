"use client"

import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { UserMenu } from "@/components/user-menu"
import { useUser } from "@/lib/user-context" // 确保导入 useUser

export function SiteHeader() {
  const { user, loading } = useUser()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold">我的博客</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/blog" className="transition-colors hover:text-foreground/80 text-foreground/60">
              博客
            </Link>
            {user?.is_admin && (
              <Link href="/admin" className="transition-colors hover:text-foreground/80 text-foreground/60">
                管理后台
              </Link>
            )}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <ModeToggle />
            {!loading && <UserMenu />}
          </nav>
        </div>
      </div>
    </header>
  )
}
