"use client"

import { useState } from "react"
import { useUser } from "@/lib/user-context"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import ProfilePage from "@/app/profile/page"

export default function SettingsPage() {
  const { user, loading, logout } = useUser()
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState(true)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [message, setMessage] = useState("")
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [isTwoFactorDialogOpen, setIsTwoFactorDialogOpen] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordLoading, setPasswordLoading] = useState(false)
  const router = useRouter()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>加载中...</div>
      </div>
    )
  }

  if (!user) {
    router.push("/login")
    return null
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/")
    } catch (error) {
      console.error("退出登录失败:", error)
    }
  }

  const handleSaveSettings = () => {
    setMessage("设置已保存")
    setTimeout(() => setMessage(""), 3000)
  }

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage("新密码和确认密码不匹配")
      return
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage("新密码长度至少6位")
      return
    }

    setPasswordLoading(true)
    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setMessage("密码修改成功")
        setIsPasswordDialogOpen(false)
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
      } else {
        setMessage(data.message || "密码修改失败")
      }
    } catch (error) {
      setMessage("网络错误，请稍后重试")
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleTwoFactorToggle = () => {
    if (twoFactorEnabled) {
      // 禁用两步验证
      setTwoFactorEnabled(false)
      setMessage("两步验证已禁用")
    } else {
      // 启用两步验证
      setIsTwoFactorDialogOpen(true)
    }
  }

  const handleEnableTwoFactor = () => {
    // 这里应该实现真正的两步验证启用逻辑
    setTwoFactorEnabled(true)
    setIsTwoFactorDialogOpen(false)
    setMessage("两步验证已启用")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <ProfilePage />
        </div>
      </div>
    </div>
  )
}
