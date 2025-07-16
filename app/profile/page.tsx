"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useUser } from "@/lib/user-context" // 确保导入 useUser

export default function ProfilePage() {
  const { user, loading, refreshUser } = useUser()
  const { toast } = useToast()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0])
    } else {
      setSelectedFile(null)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !user) {
      toast({
        title: "提示",
        description: "请选择一个文件。",
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append("file", selectedFile)

    try {
      const response = await fetch("/api/upload/avatar", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "上传成功",
          description: "您的头像已更新。",
        })
        refreshUser() // 刷新用户上下文以显示新头像
        setSelectedFile(null)
      } else {
        toast({
          title: "上传失败",
          description: data.message || "头像上传过程中发生错误。",
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
      <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8 flex justify-center items-center min-h-[calc(100vh-64px)]">
        <p>加载中...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8 flex justify-center items-center min-h-[calc(100vh-64px)]">
        <p>请登录以查看个人资料。</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>个人资料</CardTitle>
          <CardDescription>管理您的账户信息。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="relative w-24 h-24 rounded-full overflow-hidden">
              <Image
                src={user.avatar_url || "/placeholder-user.jpg"}
                alt="用户头像"
                fill
                style={{ objectFit: "cover" }}
                className="rounded-full"
              />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-semibold">{user.username}</h3>
              <p className="text-muted-foreground">{user.email}</p>
              <p className="text-sm text-muted-foreground">{user.is_admin ? "管理员" : "普通用户"}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar">更换头像</Label>
            <div className="flex items-center space-x-2">
              <Input id="avatar" type="file" accept="image/*" onChange={handleFileChange} />
              <Button onClick={handleUpload} disabled={!selectedFile || uploading}>
                {uploading ? "上传中..." : "上传"}
              </Button>
            </div>
          </div>

          {/* 更多个人资料字段，例如： */}
          <div className="space-y-2">
            <Label htmlFor="bio">个人简介</Label>
            <Input id="bio" type="text" placeholder="添加您的个人简介" defaultValue="暂无简介" disabled />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
