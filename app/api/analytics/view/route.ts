import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { verifyToken } from "@/lib/verify-token"
import {env} from "@/lib/env"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { postId } = body

    if (!postId) {
      return NextResponse.json({ message: "文章ID是必填项" }, { status: 400 })
    }

    // 获取用户信息（如果已登录）
    let user = null
    try {
      user = await verifyToken(request)
    } catch (error) {
      // 用户未登录，继续处理
    }

    // 获取IP地址
    const forwarded = request.headers.get("x-forwarded-for")
    const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "unknown"

    // 获取User-Agent
    const userAgent = request.headers.get("user-agent") || "unknown"

    // 记录访问
    await sql`
      INSERT INTO post_analytics (
        post_id, user_id, ip_address, user_agent, is_logged_in
      ) VALUES (
        ${postId}, ${user?.id || null}, ${ip}, ${userAgent}, ${!!user}
      )
    `

    // 更新文章的访问计数
    await sql`
      UPDATE posts 
      SET view_count = view_count + 1 
      WHERE id = ${postId}
    `

    return NextResponse.json({ message: "访问记录成功" })
  } catch (error) {
    console.error("记录访问错误:", error)
    return NextResponse.json({ message: "记录访问失败" }, { status: 500 })
  }
}
