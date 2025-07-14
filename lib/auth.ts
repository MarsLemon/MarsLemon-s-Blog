import { createHash } from "crypto"

// 简单的密码存储，实际项目中应该使用数据库
let storedPasswordHash: string | null = null

export function hashPassword(password: string): string {
  return createHash("md5").update(password).digest("hex")
}

export function setPassword(password: string): void {
  storedPasswordHash = hashPassword(password)
}

export function verifyPassword(password: string): boolean {
  if (!storedPasswordHash) return false
  return hashPassword(password) === storedPasswordHash
}

export function hasPassword(): boolean {
  return storedPasswordHash !== null
}

export function clearPassword(): void {
  storedPasswordHash = null
}
