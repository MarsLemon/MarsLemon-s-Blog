import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { verifyToken, updateUserAvatar } from "@/lib/auth"
import { getFileHash } from "@/lib/file-hash"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    // 验证用户身份
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ success: false, message: "未授权" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ success: false, message: "未找到文件" }, { status: 400 })
    }

    // 验证文件类型
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ success: false, message: "只能上传图片文件" }, { status: 400 })
    }

    // 验证文件大小（限制为5MB）
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ success: false, message: "图片大小不能超过5MB" }, { status: 400 })
    }

    // 生成文件哈希
    const fileBuffer = Buffer.from(await file.arrayBuffer())
    const fileHash = getFileHash(fileBuffer)

    // 检查文件是否已存在
    const existingFiles = await sql`
      SELECT url FROM files WHERE hash = ${fileHash} LIMIT 1
    `

    let fileUrl: string
    if (existingFiles.length > 0) {
      fileUrl = existingFiles[0].url
      console.log(`文件已存在，使用现有文件: ${fileUrl}`)
    } else {
      // 生成文件名
      const timestamp = Date.now()
      const fileExtension = file.name.split(".").pop()
      const filename = `avatars/${user.id}-${timestamp}.${fileExtension}`

      // 上传到 Vercel Blob
      const blob = await put(filename, file, {
        access: "public",
        contentType: file.type,
      })
      fileUrl = blob.url

      // 记录文件信息到数据库
      await sql`
        INSERT INTO files (name, type, size, hash, url, created_at)
        VALUES (${file.name}, ${file.type}, ${file.size}, ${fileHash}, ${fileUrl}, NOW())
      `
      console.log(`文件上传成功: ${fileUrl}`)
    }

    // 更新用户头像URL
    const updatedUser = await updateUserAvatar(user.id, fileUrl)

    return NextResponse.json({
      success: true,
      message: "头像更新成功",
      avatarUrl: fileUrl,
      user: updatedUser,
    })
  } catch (error) {
    console.error("头像上传错误:", error)
    return NextResponse.json({ success: false, message: "服务器错误，头像上传失败" }, { status: 500 })
  }
}
