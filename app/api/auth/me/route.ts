import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ message: "未登录" }, { status: 401 })
    }
    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    console.error("获取用户信息失败:", error)
    return NextResponse.json({ message: "服务器错误，获取用户信息失败" }, { status: 500 })
  }
}
