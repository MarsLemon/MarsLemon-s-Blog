import { NextResponse } from "next/server"
import { initializeAdmin } from "@/lib/auth"

export async function GET() {
  try {
    await initializeAdmin()
    return NextResponse.json({
      success: true,
      message: "管理员账户初始化完成",
    })
  } catch (error) {
    console.error("初始化错误:", error)
    return NextResponse.json(
      {
        success: false,
        message: `初始化失败: ${error}`,
      },
      { status: 500 },
    )
  }
}

export async function POST() {
  return GET()
}
