import crypto from "crypto"
const isServer = typeof window === 'undefined';

export function getFileHash(buffer: Buffer): string {
 if (isServer) {
    throw new Error('getFileHash should only be used in client components');
  }
  return crypto.createHash("sha256").update(buffer).digest("hex")
}

export function calculateFileHash(buffer: Buffer): string {
  return getFileHash(buffer)
}

export async function getFileBuffer(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer()
  return Buffer.from(arrayBuffer)
}
