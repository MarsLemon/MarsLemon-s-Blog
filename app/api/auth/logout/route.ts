import { NextResponse } from "next/server"
import { deleteSession } from "@/lib/auth"

export async function POST() {
  try {
    await deleteSession()
    return NextResponse.json({ message: "登出成功" }, { status: 200 })
  } catch (error) {
    console.error("登出失败:", error)
    return NextResponse.json({ message: "服务器错误，登出失败" }, { status: 500 })
  }
}
