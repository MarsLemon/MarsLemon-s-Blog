import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

const sql = neon(process.env.DATABASE_URL!)

const secretKey = process.env.JWT_SECRET || "default_secret_key_for_dev_only_please_change_this_in_prod"
const encodedKey = new TextEncoder().encode(secretKey)

export interface User {
  id: number
  username: string
  email: string
  avatar_url: string | null
  is_admin: boolean
  is_verified: boolean
}

export async function encrypt(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h") // Token expires in 2 hours
    .sign(encodedKey)
}

export async function decrypt(session: string | undefined = ""): Promise<User | null> {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    })
    return payload as User
  } catch (error) {
    console.error("Failed to decrypt session:", error)
    return null
  }
}

export async function createSession(user: User) {
  const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours
  const session = await encrypt({ user, expiresAt })

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

export async function getSessionUser(): Promise<User | null> {
  const session = cookies().get("session-token")?.value
  if (!session) return null
  return await decrypt(session)
}

export async function getUserByUsernameOrEmail(identifier: string): Promise<User | null> {
  const [user] = await sql<User[]>`
    SELECT id, username, email, password_hash, avatar_url, is_admin, is_verified
    FROM users
    WHERE username = ${identifier} OR email = ${identifier}
    LIMIT 1
  `
  return user ?? null
}

export async function createUser(username: string, email: string, password_hash: string): Promise<User> {
  const [newUser] = await sql<User[]>`
    INSERT INTO users (username, email, password_hash, is_admin, is_verified)
    VALUES (${username}, ${email}, ${password_hash}, FALSE, FALSE)
    RETURNING id, username, email, avatar_url, is_admin, is_verified
  `
  return newUser
}

export async function updateUserAvatar(userId: number, avatarUrl: string): Promise<User | null> {
  const [updatedUser] = await sql<User[]>`
    UPDATE users
    SET avatar_url = ${avatarUrl}
    WHERE id = ${userId}
    RETURNING id, username, email, avatar_url, is_admin, is_verified
  `
  return updatedUser ?? null
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}
