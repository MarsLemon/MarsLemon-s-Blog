"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"

export interface User {
  id: number
  username: string
  email: string
  avatar_url?: string | null
  is_admin: boolean
  is_verified: boolean
  created_at?: string
  two_factor_enabled?: boolean // Add this field for 2FA status
}

interface UserContextType {
  user: User | null
  loading: boolean
  login: (userData: User) => void
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
        cache: "no-store",
      })

      if (response.ok) {
        const data = await response.json()
        console.log("用户数据:", data) // 调试日志
        if (data.success && data.user) {
          setUser(data.user)
        } else {
          setUser(null)
        }
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("获取用户信息失败:", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const login = useCallback((userData: User) => {
    setUser(userData)
    setLoading(false)
  }, [])

  const logout = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
      if (response.ok) {
        setUser(null)
        router.push("/login")
      } else {
        console.error("登出失败")
      }
    } catch (error) {
      console.error("登出错误:", error)
    } finally {
      setLoading(false)
    }
  }, [router])

  const refreshUser = useCallback(async () => {
    setLoading(true)
    await fetchUser()
  }, [fetchUser])

  return <UserContext.Provider value={{ user, loading, login, logout, refreshUser }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
