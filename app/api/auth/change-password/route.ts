import { type NextRequest, NextResponse } from "next/server"
import { verifyToken, verifyPassword, hashPassword } from "@/lib/auth"
import { neon } from "@neondatabase/serverless"
import {env} from "@/lib/env"

const sql = neon(env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    // 验证用户身份
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ message: "未授权" }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ message: "当前密码和新密码都是必填项" }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ message: "新密码长度至少6位" }, { status: 400 })
    }

    // 获取用户当前密码哈希
    const users = await sql`
      SELECT password_hash FROM users WHERE id = ${user.id}
    `

    if (users.length === 0) {
      return NextResponse.json({ message: "用户不存在" }, { status: 404 })
    }

    const currentPasswordHash = users[0].password_hash

    // 验证当前密码
    const isCurrentPasswordValid = await verifyPassword(currentPassword, currentPasswordHash)
    if (!isCurrentPasswordValid) {
      return NextResponse.json({ message: "当前密码不正确" }, { status: 400 })
    }

    // 生成新密码哈希
    const newPasswordHash = await hashPassword(newPassword)

    // 更新密码
    await sql`
      UPDATE users 
      SET password_hash = ${newPasswordHash}, updated_at = NOW()
      WHERE id = ${user.id}
    `

    return NextResponse.json({ message: "密码修改成功" })
  } catch (error) {
    console.error("修改密码失败:", error)
    return NextResponse.json({ message: "服务器错误" }, { status: 500 })
  }
}
