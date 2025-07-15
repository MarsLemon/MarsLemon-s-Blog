import { type NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { env } from "@/lib/config";

const JWT_SECRET = env.JWT_SECRET || "your-secret-key";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    const isValid = await verifyAdmin(password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Create JWT token
    const token = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: "24h" });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
