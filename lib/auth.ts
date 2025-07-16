import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// 确保 JWT_SECRET 环境变量已设置
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-please-change-this-in-production"
const secret = new TextEncoder().encode(JWT_SECRET)

// 会话过期时间（例如：7 天）
const EXPIRES_IN_SECONDS = 60 * 60 * 24 * 7

export interface UserSession {
  id: string
  username: string
  email: string
  is_admin: boolean
  avatar_url?: string | null
  expires_at: number
}

/**
 * 创建用户会话 Token
 */
export async function createSession(user: {
  id: string
  username: string
  email: string
  is_admin: boolean
  avatar_url?: string | null
}): Promise<string> {
  const expires_at = Math.floor(Date.now() / 1000) + EXPIRES_IN_SECONDS
  const session: UserSession = {
    id: user.id,
    username: user.username,
    email: user.email,
    is_admin: user.is_admin,
    avatar_url: user.avatar_url,
    expires_at,
  }

  const token = await new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expires_at)
    .sign(secret)

  cookies().set("session-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(expires_at * 1000),
  })

  return token
}

/**
 * 验证会话 Token 并获取用户数据
 */
export async function verifySession(token: string): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    })
    return payload as UserSession
  } catch (error) {
    console.error("会话验证失败:", error)
    return null
  }
}

/**
 * 从请求中获取当前会话用户
 */
export async function getSessionUser(request: Request): Promise<UserSession | null> {
  const sessionToken = cookies().get("session-token")?.value
  if (!sessionToken) {
    return null
  }
  return verifySession(sessionToken)
}

/**
 * 删除用户会话
 */
export async function deleteSession(): Promise<void> {
  cookies().delete("session-token")
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
  avatar_url: string | null
} | null> {
  const [user] = await sql`
    SELECT id, username, email, password_hash, is_admin, avatar_url
    FROM users
    WHERE username = ${identifier} OR email = ${identifier}
    LIMIT 1
  `
  return user ?? null
}

/**
 * 根据用户 ID 更新头像 URL
 */
export async function updateUserAvatar(userId: string, avatarUrl: string): Promise<void> {
  await sql`
    UPDATE users
    SET avatar_url = ${avatarUrl}
    WHERE id = ${userId}
  `
}

/**
 * 查找用户是否存在（用于注册时的重复校验）
 */
export async function userExists(username: string, email: string): Promise<boolean> {
  const [user] = await sql`
    SELECT id FROM users WHERE username = ${username} OR email = ${email} LIMIT 1
  `
  return !!user
}

/**
 * 创建新用户
 */
export async function createUser(
  username: string,
  email: string,
  passwordHash: string,
): Promise<{ id: string; username: string; email: string; is_admin: boolean } | null> {
  const [newUser] = await sql`
    INSERT INTO users (username, email, password_hash, is_admin)
    VALUES (${username}, ${email}, ${passwordHash}, FALSE)
    RETURNING id, username, email, is_admin
  `
  return newUser ?? null
}
