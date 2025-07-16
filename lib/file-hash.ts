import { createHash } from "crypto"

/**
 * 计算 Buffer 的 SHA-1 哈希（40 位十六进制串）
 */
export function sha1(buffer: Buffer): string {
  return createHash("sha1").update(buffer).digest("hex")
}
