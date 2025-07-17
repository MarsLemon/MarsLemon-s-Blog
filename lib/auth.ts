import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"
import {env} from "@/lib/env"

const sql = neon(env.DATABASE_URL!)

const secretKey = env.JWT_SECRET || "default_secret_key_for_dev_only_please_change_this_in_prod"
const encodedKey = new TextEncoder().encode(secretKey)

export interface User {
  id: number
  username: string
  email: string
  avatar_url: string | null
  is_admin: boolean
  is_verified: boolean
  created_at?: string
  password_hash?: string
}

export async function encrypt(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(encodedKey)
}

export async function decrypt(session: string | undefined = ""): Promise<any | null> {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    })
    return payload
  } catch (error) {
    console.error("Failed to decrypt session:", error)
    return null
  }
}

export async function createSession(userId: number, username: string, email: string, isAdmin: boolean) {
  const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours
  const session = await encrypt({ userId, username, email, isAdmin, expiresAt })

  cookies().set("session-token", session, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  })
}

export async function deleteSession() {
  cookies().delete("session-token")
}

export async function getSessionUser(): Promise<User | null> {
  const session = cookies().get("session-token")?.value
  if (!session) return null

  const payload = await decrypt(session)
  if (!payload) return null

  // Re-fetch user from DB to ensure data is fresh and user still exists
  const users =
    await sql`SELECT id, username, email, avatar_url, is_admin, is_verified, created_at FROM users WHERE id = ${payload.userId}`

  if (users.length === 0) {
    deleteSession() // Clear invalid session
    return null
  }

  const user = users[0]
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    avatar_url: user.avatar_url,
    is_admin: user.is_admin,
    is_verified: user.is_verified,
    created_at: user.created_at,
  }
}

export async function findUserByUsernameOrEmail(identifier: string): Promise<User | null> {
  const users = await sql`
    SELECT id, username, email, password_hash, avatar_url, is_admin, is_verified, created_at
    FROM users
    WHERE username = ${identifier} OR email = ${identifier}
    LIMIT 1
  `

  if (users.length === 0) return null

  const user = users[0]
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    password_hash: user.password_hash,
    avatar_url: user.avatar_url,
    is_admin: user.is_admin,
    is_verified: user.is_verified,
    created_at: user.created_at,
  }
}

export async function updateUserAvatar(userId: number, avatarUrl: string): Promise<User | null> {
  const users = await sql`
    UPDATE users
    SET avatar_url = ${avatarUrl}
    WHERE id = ${userId}
    RETURNING id, username, email, avatar_url, is_admin, is_verified, created_at
  `

  if (users.length === 0) return null

  const user = users[0]
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    avatar_url: user.avatar_url,
    is_admin: user.is_admin,
    is_verified: user.is_verified,
    created_at: user.created_at,
  }
}

export async function registerUser(username: string, email: string, password: string): Promise<User> {
  const hashedPassword = await bcrypt.hash(password, 10)
  const users = await sql`
    INSERT INTO users (username, email, password_hash, is_admin, is_verified, created_at, updated_at)
    VALUES (${username}, ${email}, ${hashedPassword}, FALSE, FALSE, NOW(), NOW())
    RETURNING id, username, email, is_admin, is_verified, created_at
  `

  const user = users[0]
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    avatar_url: null,
    is_admin: user.is_admin,
    is_verified: user.is_verified,
    created_at: user.created_at,
  }
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

// Token verification for API routes
export async function verifyToken(request: Request): Promise<User | null> {
  const cookieHeader = request.headers.get("cookie")
  if (!cookieHeader) return null

  const cookies = cookieHeader.split(";").reduce(
    (acc, cookie) => {
      const [key, value] = cookie.trim().split("=")
      acc[key] = value
      return acc
    },
    {} as Record<string, string>,
  )

  const sessionToken = cookies["session-token"]
  if (!sessionToken) return null

  const payload = await decrypt(sessionToken)
  if (!payload) return null

  const users =
    await sql`SELECT id, username, email, avatar_url, is_admin, is_verified FROM users WHERE id = ${payload.userId}`

  if (users.length === 0) return null

  const user = users[0]
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    avatar_url: user.avatar_url,
    is_admin: user.is_admin,
    is_verified: user.is_verified,
  }
}
