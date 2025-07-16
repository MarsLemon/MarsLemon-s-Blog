import { NextResponse, type NextRequest } from "next/server"
import { put } from "@vercel/blob"
import { getSessionUser, updateUserAvatar } from "@/lib/auth"
import { sha1 } from "@/lib/file-hash"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ success: false, message: "未授权，请重新登录" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File | null
    if (!file) {
      return NextResponse.json({ success: false, message: "未检测到文件" }, { status: 400 })
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ success: false, message: "仅支持图片文件" }, { status: 400 })
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, message: "文件大小不能超过 5 MB" }, { status: 400 })
    }

    // 计算哈希，检查是否已存在
    const buffer = Buffer.from(await file.arrayBuffer())
    const hash = sha1(buffer)
    const [row] = await sql<{ url: string }[]>`SELECT url FROM files WHERE hash = ${hash} LIMIT 1`

    let url = row?.url
    if (!url) {
      const ext = file.type.split("/")[1] || "jpg"
      const blob = await put(`avatars/${hash}.${ext}`, buffer, {
        access: "public",
        contentType: file.type,
      })
      url = blob.url
      await sql`
        INSERT INTO files (name, type, size, hash, url)
        VALUES (${file.name}, ${file.type}, ${file.size}, ${hash}, ${url})
      `
    }

    await updateUserAvatar(user.id, url)

    return NextResponse.json({ success: true, avatar_url: url })
  } catch (err) {
    console.error("头像上传失败:", err)
    return NextResponse.json({ success: false, message: "服务器内部错误，请稍后再试。" }, { status: 500 })
  }
}
