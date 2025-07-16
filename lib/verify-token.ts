import type { NextRequest } from "next/server"
import { getSessionUser, type User } from "./auth"

export async function verifyAdminToken(request: NextRequest): Promise<boolean> {
  try {
    const sessionToken = request.cookies.get("session-token")?.value

    if (!sessionToken) {
      return false
    }

    const user = await getSessionUser(sessionToken)
    return user?.is_admin === true
  } catch (error) {
    return false
  }
}

export async function getCurrentUser(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("session-token")?.value

    if (!sessionToken) {
      return null
    }

    return await getSessionUser(sessionToken)
  } catch (error) {
    return null
  }
}

export async function verifyToken(request: NextRequest): Promise<User | null> {
  const sessionToken = request.cookies.get("session-token")?.value

  if (!sessionToken) {
    return null
  }

  return await getSessionUser(sessionToken)
}
