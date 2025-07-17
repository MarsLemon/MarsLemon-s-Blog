"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import type { Post } from "@/lib/db"
import { UploadCloud, ImageIcon, Loader2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface PostEditorProps {
  post?: Post
  onSave: (postData: Partial<Post>) => Promise<void>
}

export function PostEditor({ post, onSave }: PostEditorProps) {
  const [title, setTitle] = useState(post?.title || "")
  const [content, setContent] = useState(post?.content || "")
  const [coverImage, setCoverImage] = useState(post?.cover_image || "")
  const [published, setPublished] = useState(post?.published || false)
  const [isFeatured, setIsFeatured] = useState(post?.is_featured || false)
  const [isPinned, setIsPinned] = useState(post?.is_pinned || false)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (post) {
      setTitle(post.title)
      setContent(post.content)
      setCoverImage(post.cover_image || "")
      setPublished(post.published)
      setIsFeatured(post.is_featured)
      setIsPinned(post.is_pinned)
    }
  }, [post])

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      setUploading(true)
      setUploadProgress(0)
      setUploadError("")

      const formData = new FormData()
      formData.append("file", file)

      try {
        const xhr = new XMLHttpRequest()
        xhr.open("POST", "/api/upload", true)

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
            setCoverImage(data.url)
            toast({
              title: "上传成功",
              description: "封面图片已成功上传。",
            })
          } else {
            const errorData = JSON.parse(xhr.responseText)
            setUploadError(errorData.message || "文件上传失败。")
            toast({
              title: "上传失败",
              description: errorData.message || "文件上传失败。",
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
        setUploadError("文件上传失败。")
        toast({
          title: "上传失败",
          description: "文件上传失败。",
          variant: "destructive",
        })
      }
    },
    [toast],
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setUploadError("") // Clear previous upload errors

    try {
      await onSave({
        title,
        content,
        cover_image: coverImage || null,
        published,
        is_featured: isFeatured,
        is_pinned: isPinned,
      })
      toast({
        title: "保存成功",
        description: post ? "文章已更新。" : "文章已创建。",
      })
      router.push("/admin")
    } catch (error: any) {
      toast({
        title: "保存失败",
        description: error.message || "保存文章失败。",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>文章内容</CardTitle>
          <CardDescription>填写文章的标题、内容和封面图片。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">标题</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="文章标题"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">内容</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="文章内容 (支持 Markdown)"
              rows={15}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cover-image">封面图片</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="cover-image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                type="button"
                onClick={() => document.getElementById("cover-image-upload")?.click()}
                variant="outline"
                disabled={uploading}
              >
                <UploadCloud className="mr-2 h-4 w-4" />
                {uploading ? "上传中..." : "选择图片"}
              </Button>
              {uploading && <Progress value={uploadProgress} className="w-full" />}
            </div>
            {uploadError && <p className="text-red-500 text-sm mt-2">{uploadError}</p>}
            <p className="text-sm text-muted-foreground">支持图片格式 (JPG, PNG, GIF, WEBP, SVG)，最大 10MB。</p>
            {coverImage && (
              <div className="mt-4 flex items-center space-x-4">
                <ImageIcon className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground truncate">{coverImage}</span>
                <Button variant="ghost" size="sm" onClick={() => setCoverImage("")}>
                  移除
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>文章设置</CardTitle>
          <CardDescription>配置文章的发布状态和特性。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="published"
              checked={published}
              onCheckedChange={(checked: boolean) => setPublished(checked)}
            />
            <Label htmlFor="published">发布</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is-featured"
              checked={isFeatured}
              onCheckedChange={(checked: boolean) => setIsFeatured(checked)}
            />
            <Label htmlFor="is-featured">精选文章</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="is-pinned" checked={isPinned} onCheckedChange={(checked: boolean) => setIsPinned(checked)} />
            <Label htmlFor="is-pinned">置顶文章</Label>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full" disabled={loading || uploading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            保存中...
          </>
        ) : (
          "保存文章"
        )}
      </Button>
    </form>
  )
}
