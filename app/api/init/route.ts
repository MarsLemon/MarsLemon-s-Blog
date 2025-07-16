import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

const sql = neon(process.env.DATABASE_URL!)

export async function POST() {
  try {
    // 检查是否已经有管理员账户
    const existingAdmin = await sql`
      SELECT id FROM users WHERE username = 'Mars' OR email = 'mars@example.com'
    `

    if (existingAdmin.length > 0) {
      return NextResponse.json({
        success: false,
        message: "管理员账户已存在",
      })
    }

    // 创建管理员账户
    const hashedPassword = await bcrypt.hash("Mars9807130015", 12)

    await sql`
      INSERT INTO users (username, email, password_hash)
      VALUES ('Mars', 'mars@example.com', ${hashedPassword})
    `

    return NextResponse.json({
      success: true,
      message: "管理员账户创建成功",
    })
  } catch (error) {
    console.error("初始化管理员账户错误:", error)
    return NextResponse.json(
      {
        success: false,
        message: "创建管理员账户失败",
      },
      { status: 500 },
    )
  }
}
