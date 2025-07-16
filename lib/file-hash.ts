import { createHash } from "crypto"

/**
 * 生成 40 位十六进制 SHA-1 哈希。
 * 在服务端可直接传入 Buffer；在客户端把 File 转换成 ArrayBuffer 再调用。
 */
export function generateFileHash(data: Buffer | ArrayBuffer | Uint8Array): string {
  // 统一转换成 Buffer 方便计算
  const buf = Buffer.isBuffer(data) ? data : Buffer.from(data instanceof Uint8Array ? data : new Uint8Array(data))
  return createHash("sha1").update(buf).digest("hex")
}

/**
 * 服务端辅助：直接计算 Buffer 的 SHA-1。
 */
export const sha1 = generateFileHash

/**
 * 客户端辅助：计算 File / Blob 的 SHA-1。
 */
export async function calculateFileHash(file: File | Blob): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  return generateFileHash(arrayBuffer)
}
