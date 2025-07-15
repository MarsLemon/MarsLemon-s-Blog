import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/verify-token"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json({ error: "Failed to get user" }, { status: 500 })
  }
}
