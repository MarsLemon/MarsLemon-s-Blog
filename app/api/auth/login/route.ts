import { type NextRequest, NextResponse } from "next/server"
import { loginUser, createSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    console.log("登录API被调用")

    const body = await request.json()
    console.log("请求体:", body)

    const { emailOrUsername, password } = body

    if (!emailOrUsername || !password) {
      console.log("缺少必需字段")
      return NextResponse.json({ success: false, message: "邮箱/用户名和密码都是必需的" }, { status: 400 })
    }

    const result = await loginUser(emailOrUsername, password)
    console.log("登录结果:", result)

    if (result.success && result.user) {
      // 创建会话
      const sessionToken = await createSession(result.user.id)

      const response = NextResponse.json({
        success: true,
        user: result.user,
        message: result.message,
      })

      // 设置HTTP-only cookie
      response.cookies.set("auth-token", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60, // 7天
        path: "/",
      })

      return response
    } else {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
        },
        { status: 401 },
      )
    }
  } catch (error) {
    console.error("登录API错误:", error)
    return NextResponse.json(
      {
        success: false,
        message: `服务器错误: ${error}`,
      },
      { status: 500 },
    )
  }
}
