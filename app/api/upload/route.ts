import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { verifyAdminToken } from "@/lib/verify-token"
import { BlobStorage } from "@/lib/blob-storage"
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
        url: existing.file_path.startsWith("http")
          ? existing.file_path
          : `https://your-blob-url.com/${existing.file_path}`,
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

    // Upload to Vercel Blob
    const blobStorage = new BlobStorage()
    const { url, path } = await blobStorage.uploadFile(file, folder)

    // Store file info in database with hash
    const result = await sql`
      INSERT INTO files (filename, original_name, file_path, file_type, file_size, folder, file_hash)
      VALUES (${path.split("/").pop()}, ${originalName}, ${url}, ${fileType}, ${fileSize}, ${folder}, ${fileHash})
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      file: result[0],
      url: url,
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
