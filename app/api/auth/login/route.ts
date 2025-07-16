import { NextResponse } from "next/server"
import { findUserByUsernameOrEmail, verifyPassword, createSession } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { identifier, password } = await request.json()

    if (!identifier || !password) {
      return NextResponse.json({ message: "用户名/邮箱和密码是必填项" }, { status: 400 })
    }

    const user = await findUserByUsernameOrEmail(identifier)

    if (!user) {
      console.log(`登录失败: 用户 ${identifier} 不存在`)
      return NextResponse.json({ message: "用户名或密码不正确" }, { status: 401 })
    }

    const isPasswordValid = await verifyPassword(password, user.password_hash)

    if (!isPasswordValid) {
      console.log(`登录失败: 用户 ${identifier} 密码不正确`)
      return NextResponse.json({ message: "用户名或密码不正确" }, { status: 401 })
    }

    // 移除敏感信息，确保 User 接口匹配
    const userForSession = {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar_url: user.avatar_url,
      is_admin: user.is_admin,
      is_verified: user.is_verified,
    }

    await createSession(userForSession)

    return NextResponse.json({ message: "登录成功", user: userForSession }, { status: 200 })
  } catch (error) {
    console.error("登录失败:", error)
    return NextResponse.json({ message: "服务器错误，登录失败" }, { status: 500 })
  }
}
