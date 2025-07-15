import crypto from "crypto"

export function calculateFileHash(buffer: ArrayBuffer): string {
  const hash = crypto.createHash("sha1")
  hash.update(new Uint8Array(buffer))
  return hash.digest("hex")
}

export async function getFileBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as ArrayBuffer)
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}
