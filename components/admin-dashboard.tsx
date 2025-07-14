"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MarkdownEditor } from "@/components/markdown-editor"
import { PostList } from "@/components/post-list"
import { type BlogPost, getAllPosts } from "@/lib/blog-storage"
import { createPostAction, updatePostAction, publishPostAction, unpublishPostAction } from "@/app/admin/actions"
import { Plus, FileText, Settings } from "lucide-react"

export function AdminDashboard() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [activeTab, setActiveTab] = useState("posts")
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setPosts(getAllPosts())
  }, [])

  const refreshPosts = () => {
    setPosts(getAllPosts())
  }

  const handleCreateNew = () => {
    setEditingPost(null)
    setActiveTab("editor")
  }

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post)
    setActiveTab("editor")
  }

  const handleSave = async (title: string, content: string) => {
    setSaving(true)
    try {
      if (editingPost) {
        const formData = new FormData()
        formData.append("id", editingPost.id)
        formData.append("title", title)
        formData.append("content", content)

        const result = await updatePostAction(formData)
        if (result.success) {
          setEditingPost(result.post!)
          refreshPosts()
        }
      } else {
        const formData = new FormData()
        formData.append("title", title)
        formData.append("content", content)

        const result = await createPostAction(formData)
        if (result.success) {
          setEditingPost(result.post!)
          refreshPosts()
        }
      }
    } finally {
      setSaving(false)
    }
  }

  const handlePublishToggle = async () => {
    if (!editingPost) return

    try {
      if (editingPost.published) {
        const result = await unpublishPostAction(editingPost.id)
        if (result.success) {
          setEditingPost(result.post!)
          refreshPosts()
        }
      } else {
        const result = await publishPostAction(editingPost.id)
        if (result.success) {
          setEditingPost(result.post!)
          refreshPosts()
        }
      }
    } catch (error) {
      console.error("发布操作失败:", error)
    }
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="flex items-center justify-between mb-6">
        <TabsList>
          <TabsTrigger value="posts">
            <FileText className="w-4 h-4 mr-2" />
            文章列表
          </TabsTrigger>
          <TabsTrigger value="editor">
            <Settings className="w-4 h-4 mr-2" />
            编辑器
          </TabsTrigger>
        </TabsList>

        <Button onClick={handleCreateNew}>
          <Plus className="w-4 h-4 mr-2" />
          新建文章
        </Button>
      </div>

      <TabsContent value="posts">
        <PostList posts={posts} onEdit={handleEdit} />
      </TabsContent>

      <TabsContent value="editor">
        <Card>
          <CardHeader>
            <CardTitle>{editingPost ? "编辑文章" : "新建文章"}</CardTitle>
          </CardHeader>
          <CardContent>
            <MarkdownEditor
              initialTitle={editingPost?.title || ""}
              initialContent={editingPost?.content || ""}
              onSave={handleSave}
              onPublish={editingPost ? handlePublishToggle : undefined}
              isPublished={editingPost?.published || false}
              saving={saving}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
