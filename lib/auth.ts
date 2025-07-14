import bcrypt from "bcryptjs"
import { sql } from "./db"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function checkAdminExists(): Promise<boolean> {
  const result = await sql`SELECT COUNT(*) as count FROM admin`
  return result[0].count > 0
}

export async function createAdmin(password: string): Promise<void> {
  const hashedPassword = await hashPassword(password)
  await sql`INSERT INTO admin (password_hash) VALUES (${hashedPassword})`
}

export async function verifyAdmin(password: string): Promise<boolean> {
  const result = await sql`SELECT password_hash FROM admin LIMIT 1`
  if (result.length === 0) return false

  return verifyPassword(password, result[0].password_hash)
}
