'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { UserMenu } from '@/components/user-menu';
import { useUser } from '@/lib/user-context';
import { Loader2 } from 'lucide-react';

export function SiteHeader() {
  const { user, loading } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <span className="hidden font-bold sm:inline-block">我的博客</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="/"
            >
              首页
            </Link>
            <Link
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="/blog"
            >
              博客
            </Link>
            <Link
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="/about"
            >
              关于
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* 搜索框可以在这里添加 */}
          </div>
          <nav className="flex items-center space-x-2">
            <ModeToggle />
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : user ? (
              <UserMenu />
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">登录</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/register">注册</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
