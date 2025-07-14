"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import type { BlogPost } from "@/lib/blog-storage"
import { publishPostAction, unpublishPostAction, deletePostAction } from "@/app/admin/actions"
import { Edit, Trash2, Globe, GlobeLock } from "lucide-react"

interface PostListProps {
  posts: BlogPost[]
  onEdit: (post: BlogPost) => void
}

export function PostList({ posts, onEdit }: PostListProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const handlePublishToggle = async (post: BlogPost) => {
    setLoading(post.id)
    try {
      if (post.published) {
        await unpublishPostAction(post.id)
      } else {
        await publishPostAction(post.id)
      }
    } finally {
      setLoading(null)
    }
  }

  const handleDelete = async (id: string) => {
    setLoading(id)
    try {
      await deletePostAction(id)
    } finally {
      setLoading(null)
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  if (posts.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">还没有文章，创建第一篇吧！</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg">{post.title}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>创建于 {formatDate(post.createdAt)}</span>
                  {post.updatedAt.getTime() !== post.createdAt.getTime() && (
                    <span>• 更新于 {formatDate(post.updatedAt)}</span>
                  )}
                  {post.publishedAt && <span>• 发布于 {formatDate(post.publishedAt)}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={post.published ? "default" : "secondary"}>{post.published ? "已发布" : "草稿"}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(post)}>
                <Edit className="w-4 h-4 mr-2" />
                编辑
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePublishToggle(post)}
                disabled={loading === post.id}
              >
                {post.published ? (
                  <>
                    <GlobeLock className="w-4 h-4 mr-2" />
                    取消发布
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4 mr-2" />
                    发布
                  </>
                )}
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" disabled={loading === post.id}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    删除
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>确认删除</AlertDialogTitle>
                    <AlertDialogDescription>确定要删除文章 "{post.title}" 吗？此操作无法撤销。</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(post.id)}>删除</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
