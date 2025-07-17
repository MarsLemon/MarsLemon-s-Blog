"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Pencil, Trash2, Plus, Eye, Calendar, User } from "lucide-react"
import Link from "next/link"
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

interface Post {
  id: number
  title: string
  excerpt: string
  slug: string
  cover_image: string | null
  author_name: string
  created_at: string
  published: boolean
  is_featured: boolean
  is_pinned: boolean
  view_count?: number
}

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/admin/posts")
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      } else {
        throw new Error("获取文章列表失败")
      }
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

  const togglePublished = async (postId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          published: !currentStatus,
          only_change_publish:true,
        }),
      })

      if (response.ok) {
        toast({
          title: "更新成功",
          description: `文章已${!currentStatus ? "发布" : "取消发布"}`,
        })
        fetchPosts() // 重新获取文章列表
      } else {
        throw new Error("更新失败")
      }
    } catch (error) {
      toast({
        title: "错误",
        description: "更新文章状态失败",
        variant: "destructive",
      })
    }
  }

  const deletePost = async (postId: number) => {
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "删除成功",
          description: "文章已删除",
        })
        fetchPosts() // 重新获取文章列表
      } else {
        throw new Error("删除失败")
      }
    } catch (error) {
      toast({
        title: "错误",
        description: "删除文章失败",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">加载中...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">管理后台</h1>
        <Button asChild>
          <Link href="/admin/posts/new">
            <Plus className="mr-2 h-4 w-4" />
            新建文章
          </Link>
        </Button>
      </div>

      <div className="grid gap-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <div className="flex">
                {post.cover_image && (
                  <div className="w-48 h-32 flex-shrink-0">
                    <img
                      src={post.cover_image || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold line-clamp-1">{post.title}</h3>
                        <div className="flex gap-1">
                          {post.is_pinned && <Badge variant="secondary">置顶</Badge>}
                          {post.is_featured && <Badge variant="default">精选</Badge>}
                          <Badge variant={post.published ? "default" : "secondary"}>
                            {post.published ? "已发布" : "草稿"}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-muted-foreground line-clamp-2 mb-3">{post.excerpt}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{post.author_name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(post.created_at)}</span>
                        </div>
                        {post.view_count !== undefined && (
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{post.view_count} 次阅读</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">发布</span>
                        <Switch
                          checked={post.published}
                          onCheckedChange={() => togglePublished(post.id, post.published)}
                        />
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/posts/${post.id}/edit`}>
                          <Pencil className="h-3 w-3" />
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>确认删除</AlertDialogTitle>
                            <AlertDialogDescription>
                              确定要删除文章 "{post.title}" 吗？此操作无法撤销。
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>取消</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deletePost(post.id)}>删除</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">暂无文章</p>
              <Button asChild className="mt-4">
                <Link href="/admin/posts/new">创建第一篇文章</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
