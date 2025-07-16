import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { neon } from "@neondatabase/serverless"
import { verifyToken } from "@/lib/auth"
import { calculateSHA1 } from "@/lib/file-hash"

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

    // 验证文件大小（限制为10MB）
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "文件大小不能超过10MB" }, { status: 400 })
    }

    // 验证文件类型
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "application/pdf",
      "text/plain",
      "text/markdown",
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "不支持的文件类型" }, { status: 400 })
    }

    // 读取文件内容并计算哈希
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const fileHash = calculateSHA1(buffer)

    // 检查文件是否已存在
    const existingFile = await sql`
      SELECT id, filename, file_path, file_type, file_size, created_at
      FROM files 
      WHERE file_hash = ${fileHash}
      LIMIT 1
    `

    if (existingFile.length > 0) {
      // 文件已存在，直接返回现有文件信息
      const existing = existingFile[0]
      return NextResponse.json({
        success: true,
        file: {
          id: existing.id,
          filename: existing.filename,
          url: existing.file_path,
          type: existing.file_type,
          size: existing.file_size,
          uploadedAt: existing.created_at,
        },
        message: "文件已存在，使用现有文件",
      })
    }

    // 文件不存在，上传新文件
    const timestamp = Date.now()
    const fileExtension = file.name.split(".").pop()
    const filename = `${timestamp}-${Math.random().toString(36).substring(2)}.${fileExtension}`

    // 根据文件类型确定存储路径
    let folder = "files"
    if (file.type.startsWith("image/")) {
      folder = "images"
    } else if (file.type === "application/pdf") {
      folder = "documents"
    }

    const blob = await put(`${folder}/${filename}`, buffer, {
      access: "public",
      contentType: file.type,
    })

    // 保存文件信息到数据库
    const result = await sql`
      INSERT INTO files (filename, original_name, file_path, file_type, file_size, file_hash, folder)
      VALUES (${filename}, ${file.name}, ${blob.url}, ${file.type}, ${file.size}, ${fileHash}, ${folder})
      RETURNING id, filename, file_path, file_type, file_size, created_at
    `

    const savedFile = result[0]

    return NextResponse.json({
      success: true,
      file: {
        id: savedFile.id,
        filename: savedFile.filename,
        url: savedFile.file_path,
        type: savedFile.file_type,
        size: savedFile.file_size,
        uploadedAt: savedFile.created_at,
      },
      message: "文件上传成功",
    })
  } catch (error) {
    console.error("文件上传错误:", error)
    return NextResponse.json({ error: "文件上传失败" }, { status: 500 })
  }
}
