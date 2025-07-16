"use client"

import { Button } from "@/components/ui/button"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useUser } from "@/lib/user-context" // 确保导入 useUser

export default function SettingsPage() {
  const { user, loading } = useUser()

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8 flex justify-center items-center min-h-[calc(100vh-64px)]">
        <p>加载中...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8 flex justify-center items-center min-h-[calc(100vh-64px)]">
        <p>请登录以查看设置。</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>设置</CardTitle>
          <CardDescription>管理您的偏好设置。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications" className="flex flex-col space-y-1">
              <span>电子邮件通知</span>
              <span className="font-normal leading-snug text-muted-foreground">
                接收关于新文章和重要更新的电子邮件。
              </span>
            </Label>
            <Switch id="notifications" defaultChecked aria-label="启用电子邮件通知" />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
              <span>深色模式</span>
              <span className="font-normal leading-snug text-muted-foreground">切换网站的深色或浅色主题。</span>
            </Label>
            {/* ModeToggle 应该在 SiteHeader 中处理主题切换，这里只是一个示例开关 */}
            <Switch id="dark-mode" aria-label="启用深色模式" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">账户安全</h3>
            <p className="text-sm text-muted-foreground">管理您的密码和安全设置。</p>
            <Button variant="outline">更改密码</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
