import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const user = await getSessionUser()
    if (user) {
      return NextResponse.json({ success: true, user }, { status: 200 })
    } else {
      return NextResponse.json({ success: false, message: "未登录" }, { status: 401 })
    }
  } catch (error) {
    console.error("获取当前用户失败:", error)
    return NextResponse.json({ success: false, message: "服务器错误" }, { status: 500 })
  }
}
