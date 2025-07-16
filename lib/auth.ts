import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const sql = neon(process.env.DATABASE_URL!)

export interface User {
  id: number
  username: string
  email: string
  avatar_url?: string | null
  is_admin?: boolean
  is_verified?: boolean
  created_at: string
}

export interface AuthResult {
  success: boolean
  user?: User
  token?: string
  message?: string
}

// 验证用户名格式
export function validateUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
  return usernameRegex.test(username)
}

// 验证邮箱格式
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 注册用户
export async function registerUser(username: string, email: string, password: string): Promise<AuthResult> {
  try {
    console.log("开始注册用户:", { username, email })

    // 验证输入
    if (!username || !email || !password) {
      return { success: false, message: "所有字段都是必需的" }
    }

    if (!validateUsername(username)) {
      return { success: false, message: "用户名必须是3-20个字符，只能包含字母、数字和下划线" }
    }

    if (!validateEmail(email)) {
      return { success: false, message: "邮箱格式无效" }
    }

    if (password.length < 6) {
      return { success: false, message: "密码至少需要6个字符" }
    }

    // 检查用户名是否已存在
    const existingUsername = await sql`
      SELECT id FROM users WHERE username = ${username}
    `
    if (existingUsername.length > 0) {
      return { success: false, message: "用户名已存在" }
    }

    // 检查邮箱是否已存在
    const existingEmail = await sql`
      SELECT id FROM users WHERE email = ${email}
    `
    if (existingEmail.length > 0) {
      return { success: false, message: "邮箱已存在" }
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 12)

    // 创建用户
    const result = await sql`
      INSERT INTO users (username, email, password_hash, is_verified, is_admin)
      VALUES (${username}, ${email}, ${hashedPassword}, true, false)
      RETURNING id, username, email, avatar_url, is_admin, is_verified, created_at
    `

    const user = result[0] as User
    console.log("用户创建成功:", user)

    return { success: true, user, message: "账户创建成功" }
  } catch (error) {
    console.error("注册错误:", error)
    return { success: false, message: `注册失败: ${error}` }
  }
}

// 用户登录（支持用户名或邮箱）
export async function loginUser(emailOrUsername: string, password: string): Promise<AuthResult> {
  try {
    console.log("开始登录:", { emailOrUsername })

    if (!emailOrUsername || !password) {
      return { success: false, message: "所有字段都是必需的" }
    }

    // 检查是邮箱还是用户名
    const isEmail = validateEmail(emailOrUsername)

    let user
    if (isEmail) {
      const result = await sql`
        SELECT id, username, email, password_hash, avatar_url, is_admin, is_verified, created_at
        FROM users 
        WHERE email = ${emailOrUsername} AND is_verified = true
      `
      user = result[0]
    } else {
      const result = await sql`
        SELECT id, username, email, password_hash, avatar_url, is_admin, is_verified, created_at
        FROM users 
        WHERE username = ${emailOrUsername} AND is_verified = true
      `
      user = result[0]
    }

    if (!user) {
      console.log("用户不存在或未验证")
      return { success: false, message: "凭据无效" }
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    if (!isValidPassword) {
      console.log("密码验证失败")
      return { success: false, message: "凭据无效" }
    }

    // 生成JWT token
    const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET || "fallback-secret", {
      expiresIn: "7d",
    })

    // 移除密码哈希
    const { password_hash, ...userWithoutPassword } = user

    console.log("登录成功:", userWithoutPassword)
    return {
      success: true,
      user: userWithoutPassword as User,
      token,
      message: "登录成功",
    }
  } catch (error) {
    console.error("登录错误:", error)
    return { success: false, message: `登录失败: ${error}` }
  }
}

// 验证token
export async function verifyToken(token: string): Promise<User | null> {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as { userId: number }

    const result = await sql`
      SELECT id, username, email, avatar_url, is_admin, is_verified, created_at
      FROM users 
      WHERE id = ${decoded.userId}
    `

    return (result[0] as User) || null
  } catch (error) {
    console.error("Token验证错误:", error)
    return null
  }
}

// 获取用户信息
export async function getUserById(id: number): Promise<User | null> {
  try {
    const result = await sql`
      SELECT id, username, email, avatar_url, is_admin, is_verified, created_at
      FROM users 
      WHERE id = ${id}
    `

    return (result[0] as User) || null
  } catch (error) {
    console.error("获取用户错误:", error)
    return null
  }
}

// 根据邮箱获取用户
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const result = await sql`
      SELECT id, username, email, avatar_url, is_admin, is_verified, created_at
      FROM users 
      WHERE email = ${email}
    `

    return (result[0] as User) || null
  } catch (error) {
    console.error("根据邮箱获取用户错误:", error)
    return null
  }
}

// 根据用户名获取用户
export async function getUserByUsername(username: string): Promise<User | null> {
  try {
    const result = await sql`
      SELECT id, username, email, avatar_url, is_admin, is_verified, created_at
      FROM users 
      WHERE username = ${username}
    `

    return (result[0] as User) || null
  } catch (error) {
    console.error("根据用户名获取用户错误:", error)
    return null
  }
}

// 根据 sessionToken 获取用户
export async function getSessionUser(sessionToken: string): Promise<User | null> {
  try {
    const result = await sql`
      SELECT u.id, u.username, u.email, u.avatar_url, u.is_admin, u.is_verified, u.created_at
      FROM users u
      JOIN sessions s ON u.id = s.user_id
      WHERE s.session_token = ${sessionToken} AND s.expires_at > NOW()
      LIMIT 1
    `
    return (result[0] as User) ?? null
  } catch (error) {
    console.error("获取会话用户错误:", error)
    return null
  }
}

// 创建会话
export async function createSession(userId: number): Promise<string> {
  try {
    const sessionToken = Math.random().toString(36).substring(2) + Date.now().toString(36)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7天

    await sql`
      INSERT INTO sessions (user_id, session_token, expires_at)
      VALUES (${userId}, ${sessionToken}, ${expiresAt})
    `

    return sessionToken
  } catch (error) {
    console.error("创建会话错误:", error)
    throw error
  }
}

// 删除会话
export async function deleteSession(sessionToken: string): Promise<void> {
  try {
    await sql`DELETE FROM sessions WHERE session_token = ${sessionToken}`
  } catch (error) {
    console.error("删除会话错误:", error)
  }
}

// 更新用户头像
export async function updateUserAvatar(userId: number, avatarUrl: string): Promise<void> {
  try {
    await sql`
      UPDATE users
      SET avatar_url = ${avatarUrl}, updated_at = NOW()
      WHERE id = ${userId}
    `
  } catch (error) {
    console.error("更新头像错误:", error)
    throw error
  }
}

// 初始化管理员账户
export async function initializeAdmin(): Promise<void> {
  try {
    // 检查是否已有管理员
    const adminExists = await sql`
      SELECT id FROM users WHERE is_admin = true LIMIT 1
    `

    if (adminExists.length === 0) {
      const hashedPassword = await bcrypt.hash("Mars9807130015", 12)

      await sql`
        INSERT INTO users (username, email, password_hash, is_admin, is_verified)
        VALUES ('Mars', 'mars@example.com', ${hashedPassword}, true, true)
        ON CONFLICT (email) DO NOTHING
      `

      console.log("管理员账户已创建: Mars / Mars9807130015")
    }
  } catch (error) {
    console.error("初始化管理员错误:", error)
  }
}
