import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/verify-token"
import { updateUserAvatar } from "@/lib/auth"
import { BlobStorage } from "@/lib/blob-storage"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 })
    }

    // Upload to Vercel Blob
    const blobStorage = new BlobStorage()
    const { url } = await blobStorage.uploadFile(file, "avatars")

    // Update user avatar
    await updateUserAvatar(user.id, url)

    return NextResponse.json({
      success: true,
      avatar_url: url,
    })
  } catch (error) {
    console.error("Avatar upload error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Avatar upload failed",
      },
      { status: 500 },
    )
  }
}
