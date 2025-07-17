import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { verifyToken } from "@/lib/auth"
import { getFileHash } from "@/lib/file-hash"
import { neon } from "@neondatabase/serverless"
import {env} from "@/lib/env"

const sql = neon(env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    console.log("开始处理文件上传请求")

    // 验证用户身份
    const user = await verifyToken(request)
    if (!user || !user.is_admin) {
      console.log("用户未授权或非管理员")
      return NextResponse.json({ success: false, message: "未授权" }, { status: 401 })
    }

    console.log("管理员验证成功:", user.username)

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      console.log("未找到文件")
      return NextResponse.json({ success: false, message: "未找到文件" }, { status: 400 })
    }

    console.log("文件信息:", { name: file.name, type: file.type, size: file.size })

    // 验证文件大小（限制为10MB）
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      console.log("文件大小超限:", file.size)
      return NextResponse.json({ success: false, message: "文件大小不能超过10MB" }, { status: 400 })
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
      console.log("文件类型不支持:", file.type)
      return NextResponse.json({ success: false, message: "不支持的文件类型" }, { status: 400 })
    }

    // 生成文件哈希
    const fileBuffer = Buffer.from(await file.arrayBuffer())
    const fileHash = getFileHash(fileBuffer)
    console.log("文件哈希:", fileHash)

    // 检查文件是否已存在
    const existingFiles = await sql`
      SELECT file_path FROM files WHERE file_hash = ${fileHash} LIMIT 1
    `

    let fileUrl: string
    if (existingFiles.length > 0) {
      fileUrl = existingFiles[0].file_path
      console.log(`文件已存在，使用现有文件: ${fileUrl}`)
    } else {
      // 根据文件类型确定文件夹
      let folder = "files"
      if (file.type.startsWith("image/")) {
        folder = "images"
      } else if (file.type === "application/pdf") {
        folder = "documents"
      }

      // 生成文件名
      const timestamp = Date.now()
      const fileExtension = file.name.split(".").pop() || "bin"
      const filename = `${folder}/${timestamp}-${Math.random().toString(36).substring(2)}.${fileExtension}`

      console.log("开始上传到Vercel Blob:", filename)

      // 上传到 Vercel Blob
      const blob = await put(filename, file, {
        access: "public",
        contentType: file.type,
      })
      fileUrl = blob.url

      console.log("Vercel Blob上传成功:", fileUrl)

      // 记录文件信息到数据库
      await sql`
        INSERT INTO files (filename, original_name, file_path, file_type, file_size, file_hash, folder, created_at)
        VALUES (${filename}, ${file.name}, ${fileUrl}, ${file.type}, ${file.size}, ${fileHash}, ${folder}, NOW())
      `
      console.log("文件信息已保存到数据库")
    }

    return NextResponse.json({
      success: true,
      message: "文件上传成功",
      url: fileUrl,
      file: {
        name: file.name,
        type: file.type,
        size: file.size,
        url: fileUrl,
      },
    })
  } catch (error) {
    console.error("文件上传详细错误:", error)
    return NextResponse.json(
      {
        success: false,
        message: `服务器错误: ${error instanceof Error ? error.message : "未知错误"}`,
      },
      { status: 500 },
    )
  }
}
