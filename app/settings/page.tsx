"use client"

import { useState } from "react"
import { useUser } from "@/lib/user-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Settings, Moon, Sun, Monitor, Bell, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"

export default function SettingsPage() {
  const { user, loading, logout } = useUser()
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState(true)
  const [message, setMessage] = useState("")
  const router = useRouter()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>加载中...</div>
      </div>
    )
  }

  if (!user) {
    router.push("/admin/login")
    return null
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/")
    } catch (error) {
      console.error("退出登录失败:", error)
    }
  }

  const handleSaveSettings = () => {
    setMessage("设置已保存")
    setTimeout(() => setMessage(""), 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">设置</h1>
            <p className="text-muted-foreground">管理您的偏好设置</p>
          </div>

          {message && (
            <Alert className="mb-6">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            {/* 外观设置 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  外观设置
                </CardTitle>
                <CardDescription>自定义界面外观</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>主题模式</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={theme === "light" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme("light")}
                    >
                      <Sun className="mr-2 h-4 w-4" />
                      浅色
                    </Button>
                    <Button
                      variant={theme === "dark" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme("dark")}
                    >
                      <Moon className="mr-2 h-4 w-4" />
                      深色
                    </Button>
                    <Button
                      variant={theme === "system" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme("system")}
                    >
                      <Monitor className="mr-2 h-4 w-4" />
                      跟随系统
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 通知设置 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  通知设置
                </CardTitle>
                <CardDescription>管理通知偏好</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>桌面通知</Label>
                    <p className="text-sm text-muted-foreground">接收重要更新的桌面通知</p>
                  </div>
                  <Switch checked={notifications} onCheckedChange={setNotifications} />
                </div>
              </CardContent>
            </Card>

            {/* 账户安全 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="mr-2 h-5 w-5" />
                  账户安全
                </CardTitle>
                <CardDescription>管理您的账户安全</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>当前登录状态</Label>
                  <p className="text-sm text-muted-foreground">您已作为 {user.username} 登录</p>
                </div>
                <Button variant="destructive" onClick={handleLogout}>
                  退出登录
                </Button>
              </CardContent>
            </Card>

            {/* 保存按钮 */}
            <div className="flex gap-2">
              <Button onClick={handleSaveSettings}>保存设置</Button>
              <Button variant="outline" onClick={() => router.push("/")}>
                返回首页
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
