"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useUser } from "@/lib/user-context"
import { useTranslations } from "next-intl"

interface LoginFormProps {
  onSuccess: () => void
  onSwitchToRegister: () => void
}

export function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const [emailOrUsername, setEmailOrUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { login } = useUser()
  const t = useTranslations("auth")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await login(emailOrUsername, password)
      onSuccess()
    } catch (error: any) {
      setError(error.message || t("loginFailed"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="emailOrUsername">{t("emailOrUsername")}</Label>
        <Input
          id="emailOrUsername"
          value={emailOrUsername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
          placeholder={t("emailOrUsername")}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">{t("password")}</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t("password")}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? `${t("login")}...` : t("login")}
      </Button>

      <div className="text-center">
        <Button type="button" variant="link" onClick={onSwitchToRegister}>
          {t("dontHaveAccount")}
        </Button>
      </div>
    </form>
  )
}
