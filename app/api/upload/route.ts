import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { verifyAdminToken } from "@/lib/verify-token"

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

    // Generate unique filename
    const timestamp = Date.now()
    const extension = originalName.split(".").pop()
    const filename = `${timestamp}.${extension}`
    const filePath = `/uploads/${folder}/${filename}`

    // In a real application, you would save the file to a storage service
    // For this example, we'll just store the file info in the database
    const result = await sql`
      INSERT INTO files (filename, original_name, file_path, file_type, file_size, folder)
      VALUES (${filename}, ${originalName}, ${filePath}, ${fileType}, ${fileSize}, ${folder})
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      file: result[0],
      url: filePath,
    })
  } catch (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
