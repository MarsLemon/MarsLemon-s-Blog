"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AuthForm } from "@/components/auth-form"
import { checkAuthStatus } from "../auth-actions"

export default function LoginPage() {
  const router = useRouter()
  const [authStatus, setAuthStatus] = useState<{
    isAuthenticated: boolean
    hasPassword: boolean
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus().then((status) => {
      if (status.isAuthenticated) {
        router.push("/admin")
        return
      }
      setAuthStatus(status)
      setLoading(false)
    })
  }, [router])

  const handleAuthSuccess = () => {
    router.push("/admin")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">加载中...</p>
        </div>
      </div>
    )
  }

  if (!authStatus) {
    return null
  }

  return <AuthForm mode={authStatus.hasPassword ? "login" : "setup"} onSuccess={handleAuthSuccess} />
}
