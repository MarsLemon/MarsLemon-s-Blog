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
import { Upload } from "lucide-react"
import { useDropzone } from "react-dropzone"
import type { Post } from "@/lib/db"

interface PostEditorProps {
  post?: Post
  onSave: (postData: any) => Promise<void>
}

export function PostEditor({ post, onSave }: PostEditorProps) {
  const [title, setTitle] = useState(post?.title || "")
  const [content, setContent] = useState(post?.content || "")
  const [coverImage, setCoverImage] = useState(post?.cover_image || "")
  const [isFeatured, setIsFeatured] = useState(post?.is_featured || false)
  const [isPinned, setIsPinned] = useState(post?.is_pinned || false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      for (const file of acceptedFiles) {
        try {
          const formData = new FormData()
          formData.append("file", file)

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          })

          if (response.ok) {
            const data = await response.json()
            setUploadedFiles((prev) => [...prev, data.url])

            // If it's an image and no cover image is set, use it as cover
            if (file.type.startsWith("image/") && !coverImage) {
              setCoverImage(data.url)
            }
          }
        } catch (error) {
          console.error("Upload failed:", error)
        }
      }
    },
    [coverImage],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
      "video/*": [".mp4", ".webm", ".ogg"],
      "audio/*": [".mp3", ".wav", ".ogg"],
      "application/pdf": [".pdf"],
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required")
      return
    }

    setLoading(true)

    try {
      await onSave({
        title: title.trim(),
        content: content.trim(),
        cover_image: coverImage || null,
        is_featured: isFeatured,
        is_pinned: isPinned,
      })
    } catch (error: any) {
      setError(error.message || "Failed to save post")
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

      // Set cursor position after inserted text
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + text.length
        textarea.focus()
      }, 0)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Post Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cover-image">Cover Image URL</Label>
              <Input
                id="cover-image"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="Enter cover image URL"
              />
            </div>

            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={isFeatured}
                  onCheckedChange={(checked) => setIsFeatured(checked as boolean)}
                />
                <Label htmlFor="featured">Featured Post</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pinned"
                  checked={isPinned}
                  onCheckedChange={(checked) => setIsPinned(checked as boolean)}
                />
                <Label htmlFor="pinned">Pin to Top</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>File Upload</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              {isDragActive ? (
                <p>Drop the files here...</p>
              ) : (
                <div>
                  <p className="text-lg font-medium">Drag & drop files here</p>
                  <p className="text-sm text-gray-500">or click to select files</p>
                  <p className="text-xs text-gray-400 mt-2">Supports images, videos, audio, and PDF files</p>
                </div>
              )}
            </div>

            {uploadedFiles.length > 0 && (
              <div className="mt-4">
                <Label>Uploaded Files</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {uploadedFiles.map((url, index) => (
                    <div key={index} className="relative group">
                      <div className="bg-gray-100 rounded p-2 text-sm truncate">{url.split("/").pop()}</div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-1 w-full bg-transparent"
                        onClick={() => insertTextAtCursor(`![Image](${url})`)}
                      >
                        Insert
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="write" className="w-full">
              <TabsList>
                <TabsTrigger value="write">Write</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>

              <TabsContent value="write" className="space-y-4">
                <div className="flex gap-2 mb-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => insertTextAtCursor("**Bold Text**")}>
                    Bold
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => insertTextAtCursor("*Italic Text*")}>
                    Italic
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => insertTextAtCursor("\n## Heading\n")}
                  >
                    Heading
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => insertTextAtCursor("\n- List item\n")}
                  >
                    List
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => insertTextAtCursor("[Link Text](https://example.com)")}
                  >
                    Link
                  </Button>
                </div>

                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your post content in Markdown..."
                  className="min-h-[400px] font-mono"
                  required
                />
              </TabsContent>

              <TabsContent value="preview">
                <div
                  className="prose prose-gray dark:prose-invert max-w-none min-h-[400px] p-4 border rounded-md"
                  dangerouslySetInnerHTML={{
                    __html: content ? require("marked").marked(content) : "<p>Nothing to preview yet...</p>",
                  }}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : post ? "Update Post" : "Create Post"}
          </Button>
          <Button type="button" variant="outline" onClick={() => window.history.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
