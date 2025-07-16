"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useUser } from "@/lib/user-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

export function UserMenu() {
  const { user, refreshUser } = useUser()
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "登出成功",
          description: "您已成功登出。",
        })
        refreshUser() // 刷新用户上下文
        router.push("/")
      } else {
        const data = await response.json()
        toast({
          title: "登出失败",
          description: data.message || "登出失败，请稍后再试。",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("登出请求失败:", error)
      toast({
        title: "错误",
        description: "网络或服务器错误，请稍后再试。",
        variant: "destructive",
      })
    }
  }

  if (!user) {
    return null // 如果没有用户，不显示菜单
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar_url || "/placeholder-user.jpg"} alt={user.username || "用户头像"} />
            <AvatarFallback>{user.username ? user.username[0].toUpperCase() : "U"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.username}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">个人资料</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">设置</Link>
        </DropdownMenuItem>
        {user.is_admin && (
          <DropdownMenuItem asChild>
            <Link href="/admin">管理后台</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>登出</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
