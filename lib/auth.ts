import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const sql = neon(process.env.DATABASE_URL!)

export interface User {
  id: number
  username: string
  email: string
  avatar?: string
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
      INSERT INTO users (username, email, password_hash)
      VALUES (${username}, ${email}, ${hashedPassword})
      RETURNING id, username, email, avatar, created_at
    `

    const user = result[0] as User

    return { success: true, user, message: "账户创建成功" }
  } catch (error) {
    console.error("注册错误:", error)
    return { success: false, message: "注册失败" }
  }
}

// 用户登录（支持用户名或邮箱）
export async function loginUser(emailOrUsername: string, password: string): Promise<AuthResult> {
  try {
    if (!emailOrUsername || !password) {
      return { success: false, message: "所有字段都是必需的" }
    }

    // 检查是邮箱还是用户名
    const isEmail = validateEmail(emailOrUsername)

    let user
    if (isEmail) {
      const result = await sql`
        SELECT id, username, email, password_hash, avatar, created_at
        FROM users 
        WHERE email = ${emailOrUsername}
      `
      user = result[0]
    } else {
      const result = await sql`
        SELECT id, username, email, password_hash, avatar, created_at
        FROM users 
        WHERE username = ${emailOrUsername}
      `
      user = result[0]
    }

    if (!user) {
      return { success: false, message: "凭据无效" }
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    if (!isValidPassword) {
      return { success: false, message: "凭据无效" }
    }

    // 生成JWT token
    const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET!, { expiresIn: "7d" })

    // 移除密码哈希
    const { password_hash, ...userWithoutPassword } = user

    return {
      success: true,
      user: userWithoutPassword as User,
      token,
      message: "登录成功",
    }
  } catch (error) {
    console.error("登录错误:", error)
    return { success: false, message: "登录失败" }
  }
}

// 验证token
export async function verifyToken(token: string): Promise<User | null> {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }

    const result = await sql`
      SELECT id, username, email, avatar, created_at
      FROM users 
      WHERE id = ${decoded.userId}
    `

    return (result[0] as User) || null
  } catch (error) {
    return null
  }
}

// 获取用户信息
export async function getUserById(id: number): Promise<User | null> {
  try {
    const result = await sql`
      SELECT id, username, email, avatar, created_at
      FROM users 
      WHERE id = ${id}
    `

    return (result[0] as User) || null
  } catch (error) {
    return null
  }
}
