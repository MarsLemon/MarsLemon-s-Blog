import bcrypt from "bcryptjs"
import { sql } from "./db"
import crypto from "crypto"

export interface User {
  id: number
  username: string
  email: string
  avatar_url: string | null
  is_admin: boolean
  is_verified: boolean
  created_at: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function createUser(username: string, email: string, password: string): Promise<User> {
  const hashedPassword = await hashPassword(password)
  const verificationToken = crypto.randomBytes(32).toString("hex")

  const result = await sql`
    INSERT INTO users (username, email, password_hash, verification_token)
    VALUES (${username}, ${email}, ${hashedPassword}, ${verificationToken})
    RETURNING id, username, email, avatar_url, is_admin, is_verified, created_at
  `

  return result[0] as User
}

export async function verifyUser(email: string, password: string): Promise<User | null> {
  const result = await sql`
    SELECT id, username, email, password_hash, avatar_url, is_admin, is_verified, created_at
    FROM users 
    WHERE email = ${email} AND is_verified = true
  `

  if (result.length === 0) return null

  const user = result[0]
  const isValid = await verifyPassword(password, user.password_hash)

  if (!isValid) return null

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    avatar_url: user.avatar_url,
    is_admin: user.is_admin,
    is_verified: user.is_verified,
    created_at: user.created_at,
  }
}

export async function getUserById(id: number): Promise<User | null> {
  const result = await sql`
    SELECT id, username, email, avatar_url, is_admin, is_verified, created_at
    FROM users 
    WHERE id = ${id}
  `

  return result.length > 0 ? (result[0] as User) : null
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await sql`
    SELECT id, username, email, avatar_url, is_admin, is_verified, created_at
    FROM users 
    WHERE email = ${email}
  `

  return result.length > 0 ? (result[0] as User) : null
}

export async function createSession(userId: number): Promise<string> {
  const sessionToken = crypto.randomBytes(32).toString("hex")
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  await sql`
    INSERT INTO sessions (user_id, session_token, expires_at)
    VALUES (${userId}, ${sessionToken}, ${expiresAt})
  `

  return sessionToken
}

export async function getSessionUser(sessionToken: string): Promise<User | null> {
  const result = await sql`
    SELECT u.id, u.username, u.email, u.avatar_url, u.is_admin, u.is_verified, u.created_at
    FROM users u
    JOIN sessions s ON u.id = s.user_id
    WHERE s.session_token = ${sessionToken} AND s.expires_at > NOW()
  `

  return result.length > 0 ? (result[0] as User) : null
}

export async function deleteSession(sessionToken: string): Promise<void> {
  await sql`DELETE FROM sessions WHERE session_token = ${sessionToken}`
}

export async function verifyEmailToken(token: string): Promise<boolean> {
  const result = await sql`
    UPDATE users 
    SET is_verified = true, verification_token = NULL
    WHERE verification_token = ${token}
    RETURNING id
  `

  return result.length > 0
}

export async function updateUserAvatar(userId: number, avatarUrl: string): Promise<void> {
  await sql`
    UPDATE users 
    SET avatar_url = ${avatarUrl}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${userId}
  `
}

/**
 * Check if at least one admin account exists.
 */
export async function checkAdminExists(): Promise<boolean> {
  const result = await sql`SELECT COUNT(*) AS count FROM users WHERE is_admin = true`
  return Number(result[0].count) > 0
}

/**
 * Programmatically create an admin account.
 * If a user with the same username/email already exists it will be ignored.
 */
export async function createAdmin(username: string, email: string, password: string): Promise<void> {
  const hashed = await hashPassword(password)
  await sql`
    INSERT INTO users (username, email, password_hash, is_admin, is_verified)
    VALUES (${username}, ${email}, ${hashed}, true, true)
    ON CONFLICT (email) DO NOTHING
  `
}
