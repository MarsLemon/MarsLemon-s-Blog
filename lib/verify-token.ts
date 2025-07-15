import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { env } from "./config";

const JWT_SECRET =
  ((process.env.NODE_ENV === "production"
    ? process.env.JWT_SECRET
    : env.JWT_SECRET) as string) || "your-secret-key";

export async function verifyAdminToken(request: NextRequest): Promise<boolean> {
  try {
    const token = request.cookies.get("admin-token")?.value;

    if (!token) {
      return false;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { admin: boolean };
    return decoded.admin === true;
  } catch (error) {
    return false;
  }
}
