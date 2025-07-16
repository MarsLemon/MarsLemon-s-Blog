import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    // 检查是否已有管理员
    const [adminExists] = await sql`
      SELECT id FROM users WHERE is_admin = TRUE LIMIT 1
    `

    if (adminExists) {
      return NextResponse.json({ message: "管理员账户已存在，无需初始化" }, { status: 200 })
    }

    // 创建管理员账户
    const username = "Mars"
    const email = "mars@example.com"
    const password = "Mars9807130015"
    const hashedPassword = await bcrypt.hash(password, 10)

    await sql`
      INSERT INTO users (username, email, password_hash, is_admin, is_verified)
      VALUES (${username}, ${email}, ${hashedPassword}, TRUE, TRUE)
      ON CONFLICT (email) DO NOTHING
    `

    console.log("管理员账户已创建: Mars / Mars9807130015")
    return NextResponse.json({ message: "管理员账户初始化成功" }, { status: 201 })
  } catch (error) {
    console.error("初始化管理员账户失败:", error)
    return NextResponse.json({ message: "服务器错误，初始化失败" }, { status: 500 })
  }
}
