"use client"

import Link from "next/link"

import type React from "react"

import { useState } from "react"
import { useUser } from "@/lib/user-context"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export default function ProfilePage() {
  const { user, loading, refreshUser } = useUser()
  const { toast } = useToast()
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0])
    }
  }

  const handleAvatarUpload = async () => {
    if (!avatarFile || !user) {
      toast({
        title: "提示",
        description: "请选择一个文件。",
        variant: "default",
      })
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append("file", avatarFile)

    try {
      const response = await fetch("/api/upload/avatar", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "上传成功",
          description: "头像已更新。",
        })
        setAvatarFile(null) // 清除文件选择
        refreshUser() // 刷新用户数据以显示新头像
      } else {
        toast({
          title: "上传失败",
          description: data.message || "头像上传失败，请稍后再试。",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("头像上传请求失败:", error)
      toast({
        title: "错误",
        description: "网络或服务器错误，请稍后再试。",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

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
            <CardDescription>请先登录以查看您的个人资料。</CardDescription>
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
          <CardTitle>个人资料</CardTitle>
          <CardDescription>管理您的个人信息和头像。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar_url || "/placeholder-user.jpg"} alt={user.username || "用户头像"} />
              <AvatarFallback className="text-4xl">
                {user.username ? user.username[0].toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-lg font-semibold">{user.username}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar">更换头像</Label>
            <div className="flex items-center space-x-2">
              <Input id="avatar" type="file" accept="image/*" onChange={handleFileChange} />
              <Button onClick={handleAvatarUpload} disabled={!avatarFile || uploading}>
                {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {uploading ? "上传中..." : "上传"}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">支持 JPG, PNG, GIF，最大 5MB。</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">用户名</Label>
            <Input id="username" value={user.username} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">邮箱</Label>
            <Input id="email" value={user.email} readOnly />
          </div>
          {/* 可以添加更多个人资料字段 */}
        </CardContent>
      </Card>
    </div>
  )
}
