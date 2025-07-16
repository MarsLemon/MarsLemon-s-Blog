import { NextResponse } from "next/server"
import { initializeAdmin } from "@/lib/auth"

export async function POST() {
  try {
    await initializeAdmin()
    return NextResponse.json({ success: true, message: "Admin initialized" })
  } catch (error) {
    console.error("Init error:", error)
    return NextResponse.json({ error: "Initialization failed" }, { status: 500 })
  }
}
