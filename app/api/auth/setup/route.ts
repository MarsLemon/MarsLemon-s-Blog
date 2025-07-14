import { type NextRequest, NextResponse } from "next/server"
import { checkAdminExists, createAdmin } from "@/lib/auth"

export async function GET() {
  try {
    const adminExists = await checkAdminExists()
    return NextResponse.json({ adminExists })
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password || password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    const adminExists = await checkAdminExists()
    if (adminExists) {
      return NextResponse.json({ error: "Admin already exists" }, { status: 400 })
    }

    await createAdmin(password)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create admin" }, { status: 500 })
  }
}
