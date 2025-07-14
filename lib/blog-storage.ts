export interface BlogPost {
  id: string
  title: string
  content: string
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
  published: boolean
}

// 简单的内存存储，实际项目中应该使用数据库
const posts: BlogPost[] = []

export function getAllPosts(): BlogPost[] {
  return posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export function getPublishedPosts(): BlogPost[] {
  return posts
    .filter((post) => post.published)
    .sort((a, b) => (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0))
}

export function getPostById(id: string): BlogPost | undefined {
  return posts.find((post) => post.id === id)
}

export function createPost(title: string, content: string): BlogPost {
  const post: BlogPost = {
    id: Date.now().toString(),
    title,
    content,
    publishedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    published: false,
  }
  posts.push(post)
  return post
}

export function updatePost(id: string, title: string, content: string): BlogPost | null {
  const post = posts.find((p) => p.id === id)
  if (!post) return null

  post.title = title
  post.content = content
  post.updatedAt = new Date()
  return post
}

export function publishPost(id: string): BlogPost | null {
  const post = posts.find((p) => p.id === id)
  if (!post) return null

  post.published = true
  post.publishedAt = new Date()
  post.updatedAt = new Date()
  return post
}

export function unpublishPost(id: string): BlogPost | null {
  const post = posts.find((p) => p.id === id)
  if (!post) return null

  post.published = false
  post.publishedAt = null
  post.updatedAt = new Date()
  return post
}

export function deletePost(id: string): boolean {
  const index = posts.findIndex((p) => p.id === id)
  if (index === -1) return false

  posts.splice(index, 1)
  return true
}
