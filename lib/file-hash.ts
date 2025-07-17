import crypto from "crypto"

export function getFileHash(buffer: Buffer): string {
  return crypto.createHash("sha1").update(buffer).digest("hex")
}

export function calculateSHA1(buffer: Buffer): string {
  return crypto.createHash("sha1").update(buffer).digest("hex")
}

export function calculateFileHash(buffer: Buffer): string {
  return crypto.createHash("sha1").update(buffer).digest("hex")
}

export async function getFileBuffer(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer()
  return Buffer.from(arrayBuffer)
}
