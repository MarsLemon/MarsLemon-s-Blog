import { type NextRequest, NextResponse } from "next/server"
import { registerUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    console.log("注册API被调用")

    const body = await request.json()
    console.log("请求体:", body)

    const { username, email, password } = body

    if (!username || !email || !password) {
      console.log("缺少必需字段")
      return NextResponse.json({ success: false, message: "所有字段都是必需的" }, { status: 400 })
    }

    const result = await registerUser(username, email, password)
    console.log("注册结果:", result)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("注册API错误:", error)
    return NextResponse.json(
      {
        success: false,
        message: `服务器错误: ${error}`,
      },
      { status: 500 },
    )
  }
}
