import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

const sql = neon(process.env.DATABASE_URL!)

const secretKey = process.env.JWT_SECRET || "default_secret_key_for_dev"
const encodedKey = new TextEncoder().encode(secretKey)

export async function encrypt(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h") // Token expires in 2 hours
    .sign(encodedKey)
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    })
    return payload
  } catch (error) {
    console.error("Failed to decrypt session:", error)
    return null
  }
}

export async function createSession(userId: number, username: string, email: string, isAdmin: boolean) {
  const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours
  const session = await encrypt({ userId, username, email, isAdmin, expiresAt })

  cookies().set("session-token", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  })
}

export async function deleteSession() {
  cookies().delete("session-token")
}

export async function getSessionUser() {
  const session = cookies().get("session-token")?.value
  if (!session) return null

  const payload = await decrypt(session)
  if (!payload) return null

  // Re-fetch user from DB to ensure data is fresh and user still exists
  const [user] =
    await sql`SELECT id, username, email, avatar_url, is_admin, is_verified FROM users WHERE id = ${payload.userId}`
  if (!user) {
    deleteSession() // Clear invalid session
    return null
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    avatar_url: user.avatar_url,
    is_admin: user.is_admin,
    is_verified: user.is_verified,
  }
}

export async function updateUserAvatar(userId: number, avatarUrl: string) {
  const [updatedUser] = await sql`
    UPDATE users
    SET avatar_url = ${avatarUrl}
    WHERE id = ${userId}
    RETURNING id, username, email, avatar_url, is_admin, is_verified
  `
  return updatedUser
}

export async function registerUser(username: string, email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10)
  const [newUser] = await sql`
    INSERT INTO users (username, email, password_hash, is_admin, is_verified, created_at, updated_at)
    VALUES (${username}, ${email}, ${hashedPassword}, FALSE, FALSE, NOW(), NOW())
    RETURNING id, username, email, is_admin, is_verified
  `
  return newUser
}

export async function findUserByUsernameOrEmail(identifier: string) {
  const [user] = await sql`
    SELECT id, username, email, password_hash, avatar_url, is_admin, is_verified
    FROM users
    WHERE username = ${identifier} OR email = ${identifier}
  `
  return user
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

// This function is needed by the admin API routes for post slug generation
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}
