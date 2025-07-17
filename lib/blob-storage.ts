import { put, del } from "@vercel/blob"

export class BlobStorage {
  async uploadFile(file: File, folder: string): Promise<{ url: string; path: string }> {
    try {
      // Generate unique filename
      const timestamp = Date.now()
      const extension = file.name.split(".").pop()
      const filename = `${timestamp}.${extension}`
      const path = `${folder}/${filename}`

      const blob = await put(path, file, {
        access: "public",
      })

      return {
        url: blob.url,
        path: path,
      }
    } catch (error) {
      console.error("Blob upload error:", error)
      throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async deleteFile(url: string): Promise<void> {
    try {
      await del(url)
      console.log(`Blob deleted: ${url}`)
    } catch (error) {
      console.error(`Failed to delete blob ${url}:`, error)
      throw new Error(`Failed to delete blob: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }
}

export async function deleteBlob(url: string) {
  try {
    await del(url)
    console.log(`Blob deleted: ${url}`)
  } catch (error) {
    console.error(`Failed to delete blob ${url}:`, error)
    throw new Error(`Failed to delete blob: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}
