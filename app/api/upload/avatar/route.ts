import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { getSessionUser, updateUserAvatar } from "@/lib/auth"
import { createHash } from "crypto"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

/**
 * 计算文件 SHA-1 哈希，用于去重
 */
function sha1(buffer: ArrayBuffer) {
  const hash = createHash("sha1")
  hash.update(Buffer.from(buffer))
  return hash.digest("hex")
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ success: false, message: "未授权" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ success: false, message: "请上传文件" }, { status: 400 })
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ success: false, message: "仅支持图片文件" }, { status: 400 })
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, message: "文件大小不能超过 5MB" }, { status: 400 })
    }

    // 计算哈希检查是否已存在
    const buffer = Buffer.from(await file.arrayBuffer())
    const hash = sha1(buffer)

    const [existing] = await sql<{ url: string }[]>`SELECT url FROM files WHERE hash = ${hash} LIMIT 1`

    let fileUrl = existing?.url
    if (!fileUrl) {
      // 上传到 Vercel Blob
      const blob = await put(`avatars/${hash}.${file.type.split("/")[1]}`, buffer, {
        access: "public",
        contentType: file.type,
      })
      fileUrl = blob.url

      // 保存记录
      await sql`
        INSERT INTO files (name, type, size, hash, url)
        VALUES (${file.name}, ${file.type}, ${file.size}, ${hash}, ${fileUrl})
      `
    }

    // 更新用户 avatar
    await updateUserAvatar(user.id, fileUrl)

    return NextResponse.json({ success: true, avatar_url: fileUrl })
  } catch (err) {
    console.error("头像上传失败:", err)
    // 保证返回 JSON
    return NextResponse.json({ success: false, message: "服务器内部错误，请稍后重试。" }, { status: 500 })
  }
}
