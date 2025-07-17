import { neon } from "@neondatabase/serverless"
import { env } from "@/lib/env"

const sql = neon(env.DATABASE_URL!)

export interface User {
  id: number
  username: string
  email: string
  password_hash: string
  avatar_url?: string | null
  is_admin: boolean
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface Post {
  id: number
  title: string
  content: string
  excerpt: string
  slug: string
  cover_image: string | null
  author_id: number
  author_name: string
  author_avatar: string | null
  created_at: string
  updated_at: string
  published: boolean
  is_featured: boolean
  is_pinned: boolean
  view_count: number
}

export interface FileRecord {
  id: number
  filename: string
  original_name: string
  file_path: string
  file_type: string
  file_size: number
  file_hash: string
  folder: string
  created_at: string
}

export interface PostAnalytics {
  id: number
  post_id: number
  user_id: number | null
  ip_address: string
  user_agent: string
  is_logged_in: boolean
  view_date: string
}

export { sql }
