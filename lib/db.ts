import { neon } from "@neondatabase/serverless"
import {env} from "@/lib/env"
/**
 * A thin wrapper around the Neon serverless SQL client.
 * Make sure you set the NEON database connection string in your
 * environment variables as DATABASE_URL.
 */
export const sql = neon(env.DATABASE_URL as string)

/**
 * Post table row type.
 * Extend this if you add more columns.
 */
export interface Post {
  id: number
  title: string
  slug: string
  excerpt: string | null
  content: string
  cover_image: string | null
  author_name: string
  author_avatar: string
  author_bio: string | null
  is_featured: boolean
  is_pinned: boolean
  published: boolean
  created_at: string
  updated_at: string
}
