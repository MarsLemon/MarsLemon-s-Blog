import { type NextRequest, NextResponse } from "next/server"
import { loginUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { emailOrUsername, password } = await request.json()

    const result = await loginUser(emailOrUsername, password)

    if (result.success) {
      const response = NextResponse.json({
        success: true,
        user: result.user,
        message: result.message,
      })

      // 设置HTTP-only cookie
      response.cookies.set("auth-token", result.token!, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60, // 7天
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
        message: "服务器错误",
      },
      { status: 500 },
    )
  }
}
