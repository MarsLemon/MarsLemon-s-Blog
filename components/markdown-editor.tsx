"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, Save, Globe } from "lucide-react"

interface MarkdownEditorProps {
  initialTitle?: string
  initialContent?: string
  onSave: (title: string, content: string) => Promise<void>
  onPublish?: () => Promise<void>
  isPublished?: boolean
  saving?: boolean
}

export function MarkdownEditor({
  initialTitle = "",
  initialContent = "",
  onSave,
  onPublish,
  isPublished = false,
  saving = false,
}: MarkdownEditorProps) {
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)
  const [activeTab, setActiveTab] = useState("edit")

  useEffect(() => {
    setTitle(initialTitle)
    setContent(initialContent)
  }, [initialTitle, initialContent])

  const handleSave = async () => {
    await onSave(title, content)
  }

  const handlePublish = async () => {
    if (onPublish) {
      await onPublish()
    }
  }

  // 简单的markdown渲染（实际项目中建议使用react-markdown）
  const renderMarkdown = (markdown: string) => {
    return markdown
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
      .replace(/\*(.*)\*/gim, "<em>$1</em>")
      .replace(/\n/gim, "<br>")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input placeholder="文章标题" value={title} onChange={(e) => setTitle(e.target.value)} className="flex-1" />
        <div className="flex items-center gap-2">
          {isPublished && <Badge variant="secondary">已发布</Badge>}
          <Button onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "保存中..." : "保存"}
          </Button>
          {onPublish && (
            <Button onClick={handlePublish} variant="default">
              <Globe className="w-4 h-4 mr-2" />
              {isPublished ? "取消发布" : "发布"}
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit">
            <Edit className="w-4 h-4 mr-2" />
            编辑
          </TabsTrigger>
          <TabsTrigger value="preview">
            <Eye className="w-4 h-4 mr-2" />
            预览
          </TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="mt-4">
          <Textarea
            placeholder="在这里写你的markdown内容..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[500px] font-mono"
          />
        </TabsContent>

        <TabsContent value="preview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{title || "无标题"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(content) || "暂无内容",
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
