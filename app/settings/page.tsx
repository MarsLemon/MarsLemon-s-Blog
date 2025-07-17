"use client"

import { useState } from "react"
import { useUser } from "@/lib/user-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Settings, Moon, Sun, Monitor, Bell, Lock, Key, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"

export default function SettingsPage() {
  const { user, loading, logout } = useUser()
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState(true)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [message, setMessage] = useState("")
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [isTwoFactorDialogOpen, setIsTwoFactorDialogOpen] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordLoading, setPasswordLoading] = useState(false)
  const router = useRouter()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>加载中...</div>
      </div>
    )
  }

  if (!user) {
    router.push("/login")
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

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage("新密码和确认密码不匹配")
      return
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage("新密码长度至少6位")
      return
    }

    setPasswordLoading(true)
    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setMessage("密码修改成功")
        setIsPasswordDialogOpen(false)
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
      } else {
        setMessage(data.message || "密码修改失败")
      }
    } catch (error) {
      setMessage("网络错误，请稍后重试")
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleTwoFactorToggle = () => {
    if (twoFactorEnabled) {
      // 禁用两步验证
      setTwoFactorEnabled(false)
      setMessage("两步验证已禁用")
    } else {
      // 启用两步验证
      setIsTwoFactorDialogOpen(true)
    }
  }

  const handleEnableTwoFactor = () => {
    // 这里应该实现真正的两步验证启用逻辑
    setTwoFactorEnabled(true)
    setIsTwoFactorDialogOpen(false)
    setMessage("两步验证已启用")
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

                {/* 修改密码 */}
                <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Key className="mr-2 h-4 w-4" />
                      修改密码
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>修改密码</DialogTitle>
                      <DialogDescription>请输入当前密码和新密码</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="current-password">当前密码</Label>
                        <Input
                          id="current-password"
                          type="password"
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="new-password">新密码</Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirm-password">确认新密码</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handlePasswordChange} disabled={passwordLoading}>
                          {passwordLoading ? "修改中..." : "确认修改"}
                        </Button>
                        <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
                          取消
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* 两步验证 */}
                <Dialog open={isTwoFactorDialogOpen} onOpenChange={setIsTwoFactorDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      onClick={handleTwoFactorToggle}
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      两步验证 {twoFactorEnabled ? "(已启用)" : "(未启用)"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>启用两步验证</DialogTitle>
                      <DialogDescription>两步验证可以为您的账户提供额外的安全保护</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        启用两步验证后，登录时除了密码外，还需要输入手机验证码。
                      </p>
                      <div className="flex gap-2">
                        <Button onClick={handleEnableTwoFactor}>启用两步验证</Button>
                        <Button variant="outline" onClick={() => setIsTwoFactorDialogOpen(false)}>
                          取消
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

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
