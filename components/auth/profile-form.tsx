"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { useUser } from "@/lib/user-context"
import { UploadCloud } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface ProfileFormProps {
  user: {
    id: number
    username: string
    email: string
    avatar_url?: string | null
  }
  onUpdate: () => void
}

export function ProfileForm({ user, onUpdate }: ProfileFormProps) {
  const [username, setUsername] = useState(user.username)
  const [email, setEmail] = useState(user.email)
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url || "")
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState("")
  const { toast } = useToast()
  const { refreshUser } = useUser()

  useEffect(() => {
    setUsername(user.username)
    setEmail(user.email)
    setAvatarUrl(user.avatar_url || "")
  }, [user])

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadProgress(0)
    setUploadError("")

    const formData = new FormData()
    formData.append("file", file)

    try {
      const xhr = new XMLHttpRequest()
      xhr.open("POST", "/api/upload/avatar", true)

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percentCompleted = Math.round((e.loaded * 100) / e.total)
          setUploadProgress(percentCompleted)
        }
      }

      xhr.onload = () => {
        setUploading(false)
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText)
          setAvatarUrl(data.avatarUrl)
          toast({
            title: "头像上传成功",
            description: "您的头像已成功更新。",
          })
          refreshUser() // Refresh user context after avatar update
        } else {
          const errorData = JSON.parse(xhr.responseText)
          setUploadError(errorData.message || "头像上传失败。")
          toast({
            title: "头像上传失败",
            description: errorData.message || "头像上传失败。",
            variant: "destructive",
          })
        }
      }

      xhr.onerror = () => {
        setUploading(false)
        setUploadError("网络错误或服务器无响应。")
        toast({
          title: "上传失败",
          description: "网络错误或服务器无响应。",
          variant: "destructive",
        })
      }

      xhr.send(formData)
    } catch (error) {
      setUploading(false)
      setUploadError("头像上传失败。")
      toast({
        title: "上传失败",
        description: "头像上传失败。",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // In a real application, you would send username/email updates to a separate API endpoint
      // For this example, we only handle avatar update via a dedicated endpoint.
      // If username/email were editable, you'd add that logic here.
      toast({
        title: "资料更新成功",
        description: "您的个人资料已更新。",
      })
      onUpdate() // Trigger parent to refresh user data if needed
    } catch (error) {
      console.error("更新资料失败:", error)
      toast({
        title: "更新失败",
        description: "更新个人资料失败。",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={avatarUrl || "/placeholder-user.png"} alt={username} />
          <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
          <Button
            type="button"
            onClick={() => document.getElementById("avatar-upload")?.click()}
            variant="outline"
            disabled={uploading}
          >
            <UploadCloud className="mr-2 h-4 w-4" />
            {uploading ? "上传中..." : "更改头像"}
          </Button>
          {uploading && <Progress value={uploadProgress} className="w-full" />}
          {uploadError && <p className="text-red-500 text-sm mt-1">{uploadError}</p>}
          <p className="text-sm text-muted-foreground">支持图片格式，最大 5MB。</p>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="username">用户名</Label>
        <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} disabled />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">邮箱</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled />
      </div>
      {/* <Button type="submit" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            保存中...
          </>
        ) : (
          "保存更改"
        )}
      </Button> */}
    </form>
  )
}
