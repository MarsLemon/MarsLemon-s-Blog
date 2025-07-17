import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"
import { env } from "@/lib/env"
import { neon } from "@neondatabase/serverless"

const sql = neon(env.DATABASE_URL!)
const JWT_SECRET = env.JWT_SECRET!

interface DecodedToken {
  userId: number
  username: string
  email: string
  isAdmin: boolean
  iat: number
  exp: number
}

interface SessionUser {
  id: number
  username: string
  email: string
  avatar_url?: string | null
  is_admin: boolean
  is_verified: boolean
  created_at?: string
}

export async function verifyToken(request: NextRequest): Promise<SessionUser | null> {
  const token = request.cookies.get("token")?.value

  if (!token) {
    return null
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken

    const users = await sql`
      SELECT id, username, email, avatar_url, is_admin, is_verified, created_at
      FROM users
      WHERE id = ${decoded.userId}
    `

    if (users.length === 0) {
      return null
    }

    return users[0] as SessionUser
  } catch (error) {
    console.error("Token verification failed:", error)
    return null
  }
}
