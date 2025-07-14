import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function verifyAdminToken(request: NextRequest): Promise<boolean> {
  try {
    const token = request.cookies.get("admin-token")?.value

    if (!token) {
      return false
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { admin: boolean }
    return decoded.admin === true
  } catch (error) {
    return false
  }
}
