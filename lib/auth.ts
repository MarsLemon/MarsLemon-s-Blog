import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"
import { env } from "@/lib/env"

const sql = neon(env.DATABASE_URL!)
const JWT_SECRET = env.JWT_SECRET!

interface User {
  id: number
  username: string
  email: string
  password_hash: string
  avatar_url?: string | null
  is_admin: boolean
  is_verified: boolean
  created_at?: string
  updated_at?: string
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

export async function findUserByUsernameOrEmail(identifier: string): Promise<User | undefined> {
  const users = await sql`
    SELECT 
      id, username, email, password_hash, avatar_url, is_admin, is_verified, created_at
    FROM users 
    WHERE username = ${identifier} OR email = ${identifier}
  `
  return users[0] as User | undefined
}

export async function registerUser(username: string, email: string, passwordHash: string): Promise<User> {
  const result = await sql`
    INSERT INTO users (username, email, password_hash, is_admin, is_verified)
    VALUES (${username}, ${email}, ${passwordHash}, FALSE, FALSE)
    RETURNING id, username, email, avatar_url, is_admin, is_verified, created_at
  `
  return result[0] as User
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createSession(userId: number, username: string, email: string, isAdmin: boolean): Promise<void> {
  const token = jwt.sign({ userId, username, email, isAdmin }, JWT_SECRET, { expiresIn: "1d" })

  cookies().set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
  })
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const token = cookies().get("token")?.value

  if (!token) {
    return null
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number
      username: string
      email: string
      isAdmin: boolean
    }

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
    console.error("Failed to verify token:", error)
    return null
  }
}

export async function deleteSession(): Promise<void> {
  cookies().delete("token")
}

export async function verifyToken(request: NextRequest): Promise<SessionUser | null> {
  const token = request.cookies.get("token")?.value

  if (!token) {
    return null
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number
      username: string
      email: string
      isAdmin: boolean
    }

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

export async function updateUserAvatar(userId: number, avatarUrl: string): Promise<SessionUser> {
  const result = await sql`
    UPDATE users
    SET avatar_url = ${avatarUrl}, updated_at = NOW()
    WHERE id = ${userId}
    RETURNING id, username, email, avatar_url, is_admin, is_verified, created_at
  `
  return result[0] as SessionUser
}
