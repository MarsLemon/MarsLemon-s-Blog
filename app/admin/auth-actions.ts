"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { setPassword, verifyPassword, hasPassword } from "@/lib/auth"

const AUTH_COOKIE_NAME = "blog-admin-auth"
const AUTH_COOKIE_VALUE = "authenticated"

export async function setupPasswordAction(formData: FormData) {
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!password || password.length < 6) {
    return { success: false, error: "密码至少需要6位字符" }
  }

  if (password !== confirmPassword) {
    return { success: false, error: "两次输入的密码不一致" }
  }

  if (hasPassword()) {
    return { success: false, error: "密码已经设置过了" }
  }

  setPassword(password)

  // 设置认证cookie
  const cookieStore = await cookies()
  cookieStore.set(AUTH_COOKIE_NAME, AUTH_COOKIE_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7天
  })

  return { success: true }
}

export async function loginAction(formData: FormData) {
  const password = formData.get("password") as string

  if (!password) {
    return { success: false, error: "请输入密码" }
  }

  if (!hasPassword()) {
    return { success: false, error: "密码尚未设置" }
  }

  if (!verifyPassword(password)) {
    return { success: false, error: "密码错误" }
  }

  // 设置认证cookie
  const cookieStore = await cookies()
  cookieStore.set(AUTH_COOKIE_NAME, AUTH_COOKIE_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7天
  })

  return { success: true }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_COOKIE_NAME)
  redirect("/admin/login")
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME)
  return authCookie?.value === AUTH_COOKIE_VALUE
}

export async function checkAuthStatus(): Promise<{
  isAuthenticated: boolean
  hasPassword: boolean
}> {
  return {
    isAuthenticated: await isAuthenticated(),
    hasPassword: hasPassword(),
  }
}
