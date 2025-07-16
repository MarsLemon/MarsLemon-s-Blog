import { NextResponse } from "next/server"
import { checkUserExists, hashPassword, createUser, createSession } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json()

    if (!username || !email || !password) {
      return NextResponse.json({ message: "所有字段都是必填项" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ message: "密码至少需要6个字符" }, { status: 400 })
    }

    const userExists = await checkUserExists(username, email)
    if (userExists) {
      return NextResponse.json({ message: "用户名或邮箱已存在" }, { status: 409 })
    }

    const hashedPassword = await hashPassword(password)
    const newUser = await createUser(username, email, hashedPassword)

    if (!newUser) {
      return NextResponse.json({ message: "注册失败，请重试" }, { status: 500 })
    }

    // 注册成功后自动登录
    await createSession(newUser)

    return NextResponse.json({ message: "注册成功", user: newUser }, { status: 201 })
  } catch (error) {
    console.error("注册失败:", error)
    return NextResponse.json({ message: "服务器错误，注册失败" }, { status: 500 })
  }
}
