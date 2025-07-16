"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "@/lib/auth" // 确保导入正确的 User 类型

interface UserContextType {
  user: User | null
  loading: boolean
  refreshUser: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setUser(data.user)
        } else {
          setUser(null) // API返回未登录
        }
      } else {
        setUser(null) // HTTP错误
      }
    } catch (error) {
      console.error("获取用户会话失败:", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const refreshUser = () => {
    fetchUser()
  }

  return <UserContext.Provider value={{ user, loading, refreshUser }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser 必须在 UserProvider 内部使用")
  }
  return context
}
