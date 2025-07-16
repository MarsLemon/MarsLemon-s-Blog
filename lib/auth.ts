import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

const sql = neon(process.env.DATABASE_URL!)

// 确保 JWT_SECRET 环境变量已设置，并提供一个安全的默认值用于开发环境
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-please-change-this-in-production"
const encodedKey = new TextEncoder().encode(JWT_SECRET)

// 会话过期时间（例如：7 天）
const EXPIRES_IN_SECONDS = 60 * 60 * 24 * 7

export interface User {
  id: string // 数据库中的 ID 通常是字符串或数字，这里假设为字符串
  username: string
  email: string
  avatar_url?: string | null
  is_admin: boolean
  is_verified: boolean
}

export interface UserSessionPayload {
  id: string
  username: string
  email: string
  is_admin: boolean
  avatar_url?: string | null
  exp: number // JWT expiration time (Unix timestamp)
}

/**
 * 创建 JWT Token
 */
export async function encrypt(payload: UserSessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(payload.exp)
    .sign(encodedKey)
}

/**
 * 解密 JWT Token
 */
export async function decrypt(session: string | undefined = ""): Promise<UserSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    })
    return payload as UserSessionPayload
  } catch (error) {
    console.error("Failed to decrypt session:", error)
    return null
  }
}

/**
 * 创建用户会话并设置 cookie
 */
export async function createSession(user: User): Promise<void> {
  const expires_at = Math.floor(Date.now() / 1000) + EXPIRES_IN_SECONDS // Unix timestamp
  const sessionPayload: UserSessionPayload = {
    id: user.id,
    username: user.username,
    email: user.email,
    is_admin: user.is_admin,
    avatar_url: user.avatar_url,
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
 * 从 cookie 中获取当前会话用户
 */
export async function getSessionUser(): Promise<User | null> {
  const sessionToken = cookies().get("session-token")?.value
  if (!sessionToken) {
    return null
  }

  const payload = await decrypt(sessionToken)
  if (!payload) {
    deleteSession() // Token无效或过期，清除cookie
    return null
  }

  // 重新从数据库获取用户数据，确保最新状态
  const [userFromDb] = await sql<User[]>`
    SELECT id, username, email, avatar_url, is_admin, is_verified
    FROM users
    WHERE id = ${payload.id}
    LIMIT 1
  `

  if (!userFromDb) {
    deleteSession() // 用户不存在，清除cookie
    return null
  }

  return userFromDb
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
} | null> {
  const [user] = await sql`
    SELECT id, username, email, password_hash, is_admin, is_verified, avatar_url
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
    INSERT INTO users (username, email, password_hash, is_admin, is_verified)
    VALUES (${username}, ${email}, ${passwordHash}, FALSE, FALSE)
    RETURNING id, username, email, avatar_url, is_admin, is_verified
  `
  return newUser ?? null
}

/**
 * 根据用户 ID 更新头像 URL
 */
export async function updateUserAvatar(userId: string, avatarUrl: string): Promise<User | null> {
  const [updatedUser] = await sql<User[]>`
    UPDATE users
    SET avatar_url = ${avatarUrl}
    WHERE id = ${userId}
    RETURNING id, username, email, avatar_url, is_admin, is_verified
  `
  return updatedUser ?? null
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
