"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Upload, X, FileText, ImageIcon, AlertCircle } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { useToast } from "@/hooks/use-toast"
import type { Post } from "@/lib/posts"

interface PostEditorProps {
  post?: Post
  onSave: (postData: any) => Promise<void>
}

interface UploadedFile {
  name: string
  url: string
  type: string
  size: number
}

export function PostEditor({ post, onSave }: PostEditorProps) {
  const [title, setTitle] = useState(post?.title || "")
  const [content, setContent] = useState(post?.content || "")
  const [coverImage, setCoverImage] = useState(post?.cover_image || "")
  const [published, setPublished] = useState(post?.published || false)
  const [isFeatured, setIsFeatured] = useState(post?.is_featured || false)
  const [isPinned, setIsPinned] = useState(post?.is_pinned || false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  // 文件上传限制
  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
  const ALLOWED_TYPES = {
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
    "image/gif": [".gif"],
    "image/webp": [".webp"],
    "image/svg+xml": [".svg"],
    "application/pdf": [".pdf"],
    "text/plain": [".txt"],
    "text/markdown": [".md"],
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      for (const file of acceptedFiles) {
        // 检查文件大小
        if (file.size > MAX_FILE_SIZE) {
          toast({
            title: "文件过大",
            description: `文件 "${file.name}" 大小为 ${formatFileSize(file.size)}，超过了 ${formatFileSize(MAX_FILE_SIZE)} 的限制`,
            variant: "destructive",
          })
          continue
        }

        // 检查文件类型
        if (!Object.keys(ALLOWED_TYPES).includes(file.type)) {
          toast({
            title: "文件类型不支持",
            description: `文件 "${file.name}" 的类型 "${file.type}" 不被支持`,
            variant: "destructive",
          })
          continue
        }

        try {
          setIsUploading(true)
          setUploadProgress(0)

          const formData = new FormData()
          formData.append("file", file)

          // 模拟上传进度
          const progressInterval = setInterval(() => {
            setUploadProgress((prev) => {
              if (prev >= 90) {
                clearInterval(progressInterval)
                return 90
              }
              return prev + 10
            })
          }, 200)

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
            credentials: "include",
          })

          clearInterval(progressInterval)
          setUploadProgress(100)

          if (response.ok) {
            const data = await response.json()
            const uploadedFile: UploadedFile = {
              name: file.name,
              url: data.url,
              type: file.type,
              size: file.size,
            }

            setUploadedFiles((prev) => [...prev, uploadedFile])

            // 如果是图片且没有设置封面图，自动设置为封面图
            if (file.type.startsWith("image/") && !coverImage) {
              setCoverImage(data.url)
            }

            toast({
              title: "上传成功",
              description: `文件 "${file.name}" 上传成功`,
            })
          } else {
            const errorData = await response.json()
            throw new Error(errorData.message || "上传失败")
          }
        } catch (error) {
          console.error("上传失败:", error)
          toast({
            title: "上传失败",
            description: error instanceof Error ? error.message : "文件上传失败",
            variant: "destructive",
          })
        } finally {
          setIsUploading(false)
          setUploadProgress(0)
        }
      }
    },
    [coverImage, toast],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ALLOWED_TYPES,
    maxSize: MAX_FILE_SIZE,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!title.trim() || !content.trim()) {
      setError("标题和内容是必填项")
      return
    }

    setLoading(true)

    try {
      await onSave({
        title: title.trim(),
        content: content.trim(),
        cover_image: coverImage || null,
        published,
        is_featured: isFeatured,
        is_pinned: isPinned,
      })
    } catch (error: any) {
      setError(error.message || "保存失败")
    } finally {
      setLoading(false)
    }
  }

  const insertTextAtCursor = (text: string) => {
    const textarea = document.getElementById("content") as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newContent = content.substring(0, start) + text + content.substring(end)
      setContent(newContent)

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + text.length
        textarea.focus()
      }, 0)
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>文章信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">标题 *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="输入文章标题"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cover-image">封面图片URL</Label>
              <Input
                id="cover-image"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="输入封面图片URL"
              />
            </div>

            <div className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="published"
                  checked={published}
                  onCheckedChange={(checked) => setPublished(checked as boolean)}
                />
                <Label htmlFor="published">发布到首页</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={isFeatured}
                  onCheckedChange={(checked) => setIsFeatured(checked as boolean)}
                />
                <Label htmlFor="featured">设为精选</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pinned"
                  checked={isPinned}
                  onCheckedChange={(checked) => setIsPinned(checked as boolean)}
                />
                <Label htmlFor="pinned">置顶文章</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>文件上传</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* 上传限制提示 */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <div>支持的文件类型：图片 (JPG, PNG, GIF, WebP, SVG)、PDF、文本文件 (TXT, MD)</div>
                    <div>单个文件大小限制：{formatFileSize(MAX_FILE_SIZE)}</div>
                  </div>
                </AlertDescription>
              </Alert>

              {/* 上传区域 */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                {isDragActive ? (
                  <p>拖放文件到这里...</p>
                ) : (
                  <div>
                    <p className="text-lg font-medium">拖拽文件到这里或点击选择</p>
                    <p className="text-sm text-gray-500 mt-2">
                      支持图片、PDF、文本文件，单个文件最大 {formatFileSize(MAX_FILE_SIZE)}
                    </p>
                  </div>
                )}
              </div>

              {/* 上传进度 */}
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>上传中...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              )}

              {/* 已上传文件列表 */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <Label>已上传文件</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          {file.type.startsWith("image/") ? (
                            <ImageIcon className="h-4 w-4 text-blue-500" />
                          ) : (
                            <FileText className="h-4 w-4 text-gray-500" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{file.name}</div>
                            <div className="text-xs text-gray-500">{formatFileSize(file.size)}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => insertTextAtCursor(`![${file.name}](${file.url})`)}
                          >
                            插入
                          </Button>
                          <Button type="button" variant="outline" size="sm" onClick={() => removeFile(index)}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>文章内容</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="write" className="w-full">
              <TabsList>
                <TabsTrigger value="write">编写</TabsTrigger>
                <TabsTrigger value="preview">预览</TabsTrigger>
              </TabsList>

              <TabsContent value="write" className="space-y-4">
                <div className="flex flex-wrap gap-2 mb-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => insertTextAtCursor("**粗体文本**")}>
                    粗体
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => insertTextAtCursor("*斜体文本*")}>
                    斜体
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => insertTextAtCursor("~~删除线~~")}>
                    删除线
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => insertTextAtCursor("\n# 一级标题\n")}
                  >
                    H1
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => insertTextAtCursor("\n## 二级标题\n")}
                  >
                    H2
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => insertTextAtCursor("\n### 三级标题\n")}
                  >
                    H3
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => insertTextAtCursor("\n- 列表项\n")}>
                    列表
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => insertTextAtCursor("\n1. 编号列表\n")}
                  >
                    编号
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => insertTextAtCursor("[链接文本](https://example.com)")}
                  >
                    链接
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => insertTextAtCursor("![图片描述](图片URL)")}
                  >
                    图片
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => insertTextAtCursor("\n```javascript\n代码内容\n```\n")}
                  >
                    代码
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => insertTextAtCursor("\n> 引用内容\n")}
                  >
                    引用
                  </Button>
                </div>

                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="使用 Markdown 语法编写文章内容..."
                  className="min-h-[400px] font-mono"
                  required
                />
              </TabsContent>

              <TabsContent value="preview">
                <div
                  className="prose prose-gray dark:prose-invert max-w-none min-h-[400px] p-4 border rounded-md"
                  dangerouslySetInnerHTML={{
                    __html: content ? require("marked").marked(content) : "<p>暂无内容预览...</p>",
                  }}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "保存中..." : post ? "更新文章" : "创建文章"}
          </Button>
          <Button type="button" variant="outline" onClick={() => window.history.back()}>
            取消
          </Button>
        </div>
      </form>
    </div>
  )
}
