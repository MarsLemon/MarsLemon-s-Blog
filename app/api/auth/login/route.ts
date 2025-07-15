import { type NextRequest, NextResponse } from "next/server"
import { verifyUser, createSession } from "@/lib/auth"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { emailOrUsername, password } = await request.json()

    if (!emailOrUsername || !password) {
      return NextResponse.json({ error: "Email/Username and password are required" }, { status: 400 })
    }

    const user = await verifyUser(emailOrUsername, password)
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create session
    const sessionToken = await createSession(user.id)

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set("session-token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar_url: user.avatar_url,
        is_admin: user.is_admin,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
