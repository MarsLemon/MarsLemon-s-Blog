import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

const sql = neon(process.env.DATABASE_URL!)

// 确保 JWT_SECRET 环境变量已设置，并提供一个安全的默认值用于开发环境
const JWT_SECRET = process.env.JWT_SECRET || "change-me"

export interface User {
  id: string // 数据库中的 ID 通常是字符串或数字，这里假设为字符串
  username: string
  email: string
  avatar_url: string | null
  is_admin: boolean
  created_at: string
}

export interface UserSessionPayload {
  uid: string // 使用 uid 作为用户 ID 的标识
  exp: number // JWT expiration time (Unix timestamp)
}

/**
 * 创建 JWT Token
 */
export async function encrypt(payload: UserSessionPayload): Promise<string> {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: payload.exp })
}

/**
 * 解密 JWT Token
 */
export async function decrypt(session: string | undefined = ""): Promise<UserSessionPayload | null> {
  try {
    return jwt.verify(session, JWT_SECRET) as UserSessionPayload
  } catch (error) {
    console.error("Failed to decrypt session:", error)
    return null
  }
}

/**
 * 创建用户会话并设置 cookie
 */
export async function createSession(user: User): Promise<void> {
  const expires_at = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 // Unix timestamp
  const sessionPayload: UserSessionPayload = {
    uid: user.id,
    exp: expires_at,
  }

  const token = await encrypt(sessionPayload)

  cookies().set("session-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(expires_at * 1000), // Date object for cookie expires
  })
}

/**
 * 删除用户会话 cookie
 */
export async function deleteSession(): Promise<void> {
  cookies().delete("session-token")
}

/**
 * 解析 session-token 并从数据库获取用户
 */
export async function getSessionUser(): Promise<User | null> {
  const token = cookies().get("session-token")?.value
  if (!token) return null

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { uid: string }
    const [user] = await sql<
      User[]
    >`SELECT id, username, email, avatar_url, is_admin, created_at FROM users WHERE id = ${payload.uid} LIMIT 1`
    return user || null
  } catch {
    // token 失效时清理 cookie
    cookies().delete("session-token")
    return null
  }
}

/**
 * 根据用户名或邮箱查找用户
 */
export async function findUserByUsernameOrEmail(identifier: string): Promise<{
  id: string
  username: string
  email: string
  password_hash: string
  is_admin: boolean
  is_verified: boolean
  avatar_url: string | null
  created_at: string
} | null> {
  const [user] = await sql`
    SELECT id, username, email, password_hash, is_admin, is_verified, avatar_url, created_at
    FROM users
    WHERE username = ${identifier} OR email = ${identifier}
    LIMIT 1
  `
  return user ?? null
}

/**
 * 验证密码
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * 哈希密码
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

/**
 * 创建新用户
 */
export async function createUser(username: string, email: string, passwordHash: string): Promise<User | null> {
  const [newUser] = await sql<User[]>`
    INSERT INTO users (username, email, password_hash, is_admin, is_verified, created_at)
    VALUES (${username}, ${email}, ${passwordHash}, FALSE, FALSE, NOW())
    RETURNING id, username, email, avatar_url, is_admin, created_at
  `
  return newUser ?? null
}

/**
 * 更新用户头像 URL
 */
export async function updateUserAvatar(userId: string, url: string): Promise<void> {
  await sql`UPDATE users SET avatar_url = ${url}, updated_at = NOW() WHERE id = ${userId}`
}

/**
 * 检查用户名或邮箱是否已存在
 */
export async function checkUserExists(username: string, email: string): Promise<boolean> {
  const [user] = await sql`
    SELECT id FROM users WHERE username = ${username} OR email = ${email} LIMIT 1
  `
  return !!user
}
