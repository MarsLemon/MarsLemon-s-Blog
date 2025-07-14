"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PostEditor } from "@/components/admin/post-editor";
import type { Post } from "@/lib/db";

export default function EditPost({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/admin/posts`);
      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      const posts = await response.json();
      const currentPost = posts.find(
        (p: Post) => p.id === Number.parseInt(params.id)
      );

      if (currentPost) {
        setPost(currentPost);
      } else {
        router.push("/admin");
      }
    } catch (error) {
      console.error("Failed to fetch post:", error);
      router.push("/admin");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (postData: any) => {
    try {
      const response = await fetch(`/api/admin/posts/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        router.push("/admin");
      } else {
        const data = await response.json();
        throw new Error(data.error || "Failed to update post");
      }
    } catch (error) {
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Post not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Edit Post</h1>
          <p className="text-muted-foreground">Edit your blog post</p>
        </div>

        <PostEditor post={post} onSave={handleSave} />
      </div>
    </div>
  );
}
