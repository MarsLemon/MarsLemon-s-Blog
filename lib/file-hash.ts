import crypto from "crypto"

export function generateFileHash(buffer: Buffer): string {
  return crypto.createHash("sha1").update(buffer).digest("hex")
}

export function calculateSHA1FromArrayBuffer(arrayBuffer: ArrayBuffer): string {
  const buffer = Buffer.from(arrayBuffer)
  return generateFileHash(buffer)
}

// 客户端使用的文件哈希计算
export async function calculateFileHash(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  return calculateSHA1FromArrayBuffer(arrayBuffer)
}
