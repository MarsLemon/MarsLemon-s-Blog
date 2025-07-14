import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { verifyAdminToken } from "@/lib/verify-token"
import { GitHubStorage } from "@/lib/github-storage"

export async function POST(request: NextRequest) {
  try {
    const isValid = await verifyAdminToken(request)
    if (!isValid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Get file info
    const fileType = file.type
    const fileSize = file.size
    const originalName = file.name

    // Determine folder based on file type
    let folder = "other"
    if (fileType.startsWith("image/")) {
      folder = "images"
    } else if (fileType.startsWith("video/")) {
      folder = "videos"
    } else if (fileType.startsWith("audio/")) {
      folder = "audio"
    } else if (fileType === "application/pdf") {
      folder = "documents"
    }

    // Upload to GitHub
    const githubStorage = new GitHubStorage()
    const { url, path } = await githubStorage.uploadFile(file, folder)

    // Store file info in database
    const result = await sql`
      INSERT INTO files (filename, original_name, file_path, file_type, file_size, folder)
      VALUES (${path.split("/").pop()}, ${originalName}, ${path}, ${fileType}, ${fileSize}, ${folder})
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      file: result[0],
      url: url,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Upload failed",
      },
      { status: 500 },
    )
  }
}
