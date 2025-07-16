import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { getSessionUser, updateUserAvatar } from "@/lib/auth"
import { generateFileHash } from "@/lib/file-hash"
import { sql } from "@/lib/db" // 确保 db.ts 存在并导出 sql 实例

export async function POST(request: Request) {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ message: "未授权" }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get("file") as File

  if (!file) {
    return NextResponse.json({ message: "未找到文件" }, { status: 400 })
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ message: "只允许上传图片文件" }, { status: 400 })
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ message: "文件大小不能超过 5MB" }, { status: 400 })
  }

  try {
    const fileBuffer = Buffer.from(await file.arrayBuffer())
    const fileHash = generateFileHash(fileBuffer)

    // 检查文件是否已存在
    const [existingFile] = await sql`
      SELECT url FROM files WHERE hash = ${fileHash} LIMIT 1
    `

    let fileUrl: string
    if (existingFile) {
      fileUrl = existingFile.url
      console.log("文件已存在，使用现有URL:", fileUrl)
    } else {
      // 上传到 Vercel Blob
      const blob = await put(`avatars/${file.name}`, file, {
        access: "public",
        addRandomSuffix: true,
      })
      fileUrl = blob.url

      // 记录文件信息到数据库
      await sql`
        INSERT INTO files (name, type, size, hash, url)
        VALUES (${file.name}, ${file.type}, ${file.size}, ${fileHash}, ${fileUrl})
      `
      console.log("文件上传成功，新URL:", fileUrl)
    }

    // 更新用户头像URL
    const updatedUser = await updateUserAvatar(user.id, fileUrl)

    if (!updatedUser) {
      return NextResponse.json({ message: "更新用户头像失败" }, { status: 500 })
    }

    return NextResponse.json({ message: "头像上传成功", avatar_url: fileUrl }, { status: 200 })
  } catch (error) {
    console.error("头像上传失败:", error)
    return NextResponse.json({ message: "服务器错误，头像上传失败" }, { status: 500 })
  }
}
