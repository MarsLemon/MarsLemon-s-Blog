"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Post {
  id: number
  title: string
  slug: string
  excerpt: string
  published: boolean
  is_featured: boolean
  is_pinned: boolean
  created_at: string
  updated_at: string
}

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/posts", {
        credentials: "include",
      })

      if (response.status === 401) {
        router.push("/admin/login")
        return
      }

      if (!response.ok) {
        throw new Error("获取文章列表失败")
      }

      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error("获取文章列表错误:", error)
      toast({
        title: "错误",
        description: "获取文章列表失败",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number, title: string) => {
    try {
      const response = await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("删除文章失败")
      }

      toast({
        title: "成功",
        description: `文章"${title}"已删除`,
      })

      fetchPosts()
    } catch (error) {
      console.error("删除文章错误:", error)
      toast({
        title: "错误",
        description: "删除文章失败",
        variant: "destructive",
      })
    }
  }

  const handleTogglePublish = async (id: number, currentStatus: boolean) => {
    try {
      const post = posts.find((p) => p.id === id)
      if (!post) return

      const response = await fetch(`/api/admin/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...post,
          published: !currentStatus,
        }),
      })

      if (!response.ok) {
        throw new Error("更新发布状态失败")
      }

      toast({
        title: "成功",
        description: `文章已${!currentStatus ? "发布" : "取消发布"}`,
      })

      fetchPosts()
    } catch (error) {
      console.error("更新发布状态错误:", error)
      toast({
        title: "错误",
        description: "更新发布状态失败",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-lg">加载中...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">管理员后台</h1>
          <p className="text-muted-foreground">管理您的博客文章</p>
        </div>
        <Button onClick={() => router.push("/admin/posts/new")} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          新建文章
        </Button>
      </div>

      {posts.length > 0 ? (
        <div className="grid gap-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-1">{post.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {post.is_pinned && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          置顶
                        </Badge>
                      )}
                      {post.is_featured && (
                        <Badge variant="secondary" className="bg-red-100 text-red-800">
                          精选
                        </Badge>
                      )}
                      <Badge variant={post.published ? "default" : "secondary"}>
                        {post.published ? "已发布" : "草稿"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">发布到首页</span>
                      <Switch
                        checked={post.published}
                        onCheckedChange={() => handleTogglePublish(post.id, post.published)}
                      />
                    </div>
                    <Button variant="outline" size="sm" onClick={() => router.push(`/admin/posts/${post.id}/edit`)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>确认删除</AlertDialogTitle>
                          <AlertDialogDescription>
                            您确定要删除文章"{post.title}"吗？此操作无法撤销。
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>取消</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(post.id, post.title)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            删除
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  创建时间: {new Date(post.created_at).toLocaleString("zh-CN")}
                  {post.updated_at !== post.created_at && (
                    <span className="ml-4">更新时间: {new Date(post.updated_at).toLocaleString("zh-CN")}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">还没有文章</h3>
            <p className="text-muted-foreground mb-6">开始创建您的第一篇博客文章吧！</p>
            <Button onClick={() => router.push("/admin/posts/new")}>
              <Plus className="h-4 w-4 mr-2" />
              创建文章
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
