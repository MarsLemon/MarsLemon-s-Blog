import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { verifyAdminToken } from "@/lib/verify-token"
import { put } from "@vercel/blob"
import { calculateFileHash, getFileBuffer } from "@/lib/file-hash"

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

    // Calculate file hash
    const fileBuffer = await getFileBuffer(file)
    const fileHash = calculateFileHash(fileBuffer)

    // Check if file with same hash already exists
    const existingFile = await sql`
      SELECT * FROM files WHERE file_hash = ${fileHash} LIMIT 1
    `

    if (existingFile.length > 0) {
      // File already exists, return existing file info
      const existing = existingFile[0]
      return NextResponse.json({
        success: true,
        file: existing,
        url: existing.file_path,
        duplicate: true,
        message: "File already exists, using existing file",
      })
    }

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
    const filename = `${folder}/${timestamp}-${Math.random().toString(36).substring(2)}.${extension}`

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
    })

    // Store file info in database with hash
    const result = await sql`
      INSERT INTO files (filename, original_name, file_path, file_type, file_size, folder, file_hash)
      VALUES (${filename}, ${originalName}, ${blob.url}, ${fileType}, ${fileSize}, ${folder}, ${fileHash})
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      file: result[0],
      url: blob.url,
      duplicate: false,
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
