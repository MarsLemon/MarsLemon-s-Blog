"use client"

import { useUser } from "@/lib/user-context"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
  const { user, loading } = useUser()

  if (loading) {
    return (
      <div className="flex min-h-[calc(100dvh-64px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-[calc(100dvh-64px)] items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>未登录</CardTitle>
            <CardDescription>请先登录以查看您的设置。</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/login">去登录</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>设置</CardTitle>
          <CardDescription>管理您的应用偏好设置。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 主题设置 */}
          <div className="flex items-center justify-between">
            <Label htmlFor="theme-toggle" className="text-base">
              主题模式
            </Label>
            <ModeToggle />
          </div>

          {/* 通知设置示例 */}
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications" className="text-base">
              邮件通知
            </Label>
            <Switch id="email-notifications" defaultChecked />
          </div>

          {/* 账户安全设置示例 */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">账户安全</h3>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              修改密码
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              两步验证
            </Button>
          </div>

          {/* 更多设置项... */}
        </CardContent>
      </Card>
    </div>
  )
}
