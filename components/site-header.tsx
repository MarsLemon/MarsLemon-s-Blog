"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { UserMenu } from "@/components/user-menu"
import { useUser } from "@/lib/user-context"

export function SiteHeader() {
  const pathname = usePathname()
  const { user, loading } = useUser()

  const navigation = [
    { name: "首页", href: "/" },
    { name: "博客", href: "/blog" },
    { name: "关于", href: "/about" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <span className="hidden font-bold sm:inline-block">开发博客</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors hover:text-foreground/80 ${
                  pathname === item.href ? "text-foreground" : "text-foreground/60"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">{/* 搜索框可以后续添加 */}</div>
          <nav className="flex items-center space-x-2">
            <ModeToggle />
            {!loading && (
              <>
                {user ? (
                  <UserMenu user={user} />
                ) : (
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/login">登录</Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link href="/register">注册</Link>
                    </Button>
                  </div>
                )}
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
