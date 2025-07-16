"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useUser } from "@/lib/user-context"

export default function ProfilePage() {
  const { user, loading, refreshUser } = useUser()
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  if (loading) return <p className="flex h-[60vh] items-center justify-center">加载中…</p>
  if (!user) {
    router.replace("/admin/login")
    return null
  }

  const upload = async () => {
    if (!file) {
      toast({ title: "请选择文件", variant: "destructive" })
      return
    }
    setUploading(true)
    const fd = new FormData()
    fd.append("file", file)

    try {
      const res = await fetch("/api/upload/avatar", { method: "POST", body: fd })
      const json = await res.json().catch(() => ({
        success: false,
        message: `非 JSON 响应，状态 ${res.status}`,
      }))

      if (!json.success) {
        toast({ title: "上传失败", description: json.message, variant: "destructive" })
        return
      }

      toast({ title: "上传成功" })
      setFile(null)
      refreshUser()
    } catch (e) {
      console.error(e)
      toast({ title: "网络或服务器错误", variant: "destructive" })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>个人资料</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Image
              src={user.avatar_url || "/placeholder-user.jpg"}
              alt="avatar"
              width={96}
              height={96}
              className="rounded-full object-cover"
            />
            <div>
              <p className="font-semibold">{user.username}</p>
              <p className="text-muted-foreground text-sm">{user.email}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar">更换头像</Label>
            <Input id="avatar" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <Button disabled={uploading || !file} onClick={upload}>
              {uploading ? "上传中…" : "上传"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
