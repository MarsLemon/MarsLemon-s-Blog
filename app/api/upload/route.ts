import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { verifyToken } from "@/lib/auth"
import { getFileHash } from "@/lib/file-hash"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: Request) {
  try {
    const user = await verifyToken(request)
    if (!user || !user.is_admin) {
      return NextResponse.json({ message: "未授权" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ message: "未找到文件" }, { status: 400 })
    }

    // 限制文件大小，例如 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ message: "文件大小不能超过 10MB" }, { status: 400 })
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer())
    const fileHash = getFileHash(fileBuffer)

    // 检查文件是否已存在
    const [existingFile] = await sql`
      SELECT url FROM files WHERE hash = ${fileHash} LIMIT 1
    `

    let fileUrl: string
    if (existingFile) {
      fileUrl = existingFile.url
      console.log(`文件已存在，使用现有文件: ${fileUrl}`)
    } else {
      // 上传到 Vercel Blob
      const blob = await put(`uploads/${file.name}`, file, {
        access: "public",
        addRandomSuffix: true,
      })
      fileUrl = blob.url

      // 记录文件信息到数据库
      await sql`
        INSERT INTO files (name, type, size, hash, url)
        VALUES (${file.name}, ${file.type}, ${file.size}, ${fileHash}, ${fileUrl})
      `
      console.log(`文件上传成功: ${fileUrl}`)
    }

    return NextResponse.json({ message: "文件上传成功", url: fileUrl }, { status: 200 })
  } catch (error) {
    console.error("文件上传失败:", error)
    return NextResponse.json({ message: "服务器错误，文件上传失败" }, { status: 500 })
  }
}
