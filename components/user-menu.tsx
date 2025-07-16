"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { useUser } from "@/lib/user-context" // 确保导入 useUser

export function UserMenu() {
  const { user, refreshUser } = useUser()
  const { toast } = useToast()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" })
      if (response.ok) {
        toast({
          title: "登出成功",
          description: "您已成功登出。",
        })
        refreshUser() // 刷新用户上下文
        router.push("/admin/login") // 登出后跳转到登录页
      } else {
        const data = await response.json()
        toast({
          title: "登出失败",
          description: data.message || "登出过程中发生错误。",
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
    return (
      <Button asChild>
        <Link href="/admin/login">登录</Link>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar_url || "/placeholder-user.jpg"} alt={user.username} />
            <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
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
        <DropdownMenuGroup>
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
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>登出</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
