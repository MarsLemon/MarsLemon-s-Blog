import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { neon } from "@neondatabase/serverless"
import { verifyToken } from "@/lib/auth"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    // 验证用户身份
    const token = request.cookies.get("session-token")?.value
    if (!token) {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: "无效的token" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "未找到文件" }, { status: 400 })
    }

    // 验证文件类型
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "只能上传图片文件" }, { status: 400 })
    }

    // 验证文件大小（限制为5MB）
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "图片大小不能超过5MB" }, { status: 400 })
    }

    // 生成文件名
    const timestamp = Date.now()
    const fileExtension = file.name.split(".").pop()
    const filename = `avatars/${user.id}-${timestamp}.${fileExtension}`

    // 上传到 Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
      contentType: file.type,
    })

    // 更新用户头像URL
    await sql`
      UPDATE users 
      SET avatar_url = ${blob.url}, updated_at = NOW()
      WHERE id = ${user.id}
    `

    return NextResponse.json({
      success: true,
      avatarUrl: blob.url,
      message: "头像更新成功",
    })
  } catch (error) {
    console.error("头像上传错误:", error)
    return NextResponse.json({ error: "头像上传失败" }, { status: 500 })
  }
}
