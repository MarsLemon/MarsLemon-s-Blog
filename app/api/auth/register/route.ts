import { NextResponse } from "next/server"
import { findUserByUsernameOrEmail, registerUser, hashPassword, createSession } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json()

    if (!username || !email || !password) {
      return NextResponse.json({ message: "用户名、邮箱和密码是必填项" }, { status: 400 })
    }

    // 检查用户名或邮箱是否已存在
    const existingUser = await findUserByUsernameOrEmail(username)
    if (existingUser) {
      return NextResponse.json({ message: "用户名或邮箱已存在" }, { status: 409 })
    }
    const existingEmail = await findUserByUsernameOrEmail(email)
    if (existingEmail) {
      return NextResponse.json({ message: "用户名或邮箱已存在" }, { status: 409 })
    }

    const passwordHash = await hashPassword(password)
    const newUser = await registerUser(username, email, passwordHash)

    // 注册成功后自动登录
    await createSession(newUser)

    return NextResponse.json({ message: "注册成功", user: newUser }, { status: 201 })
  } catch (error) {
    console.error("注册失败:", error)
    return NextResponse.json({ message: "服务器错误，注册失败" }, { status: 500 })
  }
}
