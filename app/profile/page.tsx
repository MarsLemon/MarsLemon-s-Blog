"use client"

import type React from "react"
import { useState } from "react"
import { useUser } from "@/lib/user-context"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Upload, User, Mail, Calendar, Shield } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const { user, loading, updateAvatar } = useUser()
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    router.push("/login")
    return null
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("请选择图片文件")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("图片大小不能超过5MB")
      return
    }

    setUploading(true)
    setError("")
    setMessage("")

    try {
      await updateAvatar(file)
      setMessage("头像更新成功！")
    } catch (error: any) {
      setError(error.message || "头像更新失败")
    } finally {
      setUploading(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "未知"
    return new Date(dateString).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">个人资料</h1>
            <p className="text-muted-foreground">管理您的账户信息</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {message && (
            <Alert className="mb-6">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
              <CardDescription>您的账户基本信息</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 头像部分 */}
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar_url || "/placeholder.svg?height=96&width=96"} alt={user.username} />
                  <AvatarFallback className="text-2xl">{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>

                <div className="flex flex-col items-center space-y-2">
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById("avatar-upload")?.click()}
                    disabled={uploading}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {uploading ? "上传中..." : "更换头像"}
                  </Button>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                  <p className="text-xs text-muted-foreground">支持 JPG、PNG 格式，最大 5MB</p>
                </div>
              </div>

              {/* 用户信息 */}
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">
                    <User className="inline mr-2 h-4 w-4" />
                    用户名
                  </Label>
                  <Input id="username" value={user.username} disabled />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    <Mail className="inline mr-2 h-4 w-4" />
                    邮箱
                  </Label>
                  <Input id="email" value={user.email} disabled />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">
                    <Shield className="inline mr-2 h-4 w-4" />
                    账户类型
                  </Label>
                  <Input id="role" value={user.is_admin ? "管理员" : "普通用户"} disabled />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="created">
                    <Calendar className="inline mr-2 h-4 w-4" />
                    注册时间
                  </Label>
                  <Input id="created" value={formatDate(user.created_at)} disabled />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => router.push("/")}>返回首页</Button>
                {user.is_admin && (
                  <Button variant="outline" onClick={() => router.push("/admin")}>
                    管理后台
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
