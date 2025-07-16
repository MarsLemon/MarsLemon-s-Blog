"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { User, LogOut, LogIn, Shield } from "lucide-react"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"
import { ProfileForm } from "@/components/auth/profile-form"
import { useUser } from "@/lib/user-context"
import { useI18n } from "@/lib/i18n-context"
import type { User as UserType } from "@/lib/auth"
import Link from "next/link"

interface UserMenuProps {
  user: UserType | null
}

export function UserMenu({ user }: UserMenuProps) {
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [showProfileDialog, setShowProfileDialog] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "register">("login")
  const { logout } = useUser()
  const { t } = useI18n()

  const handleLogout = async () => {
    await logout()
  }

  const handleAuthSuccess = () => {
    setShowAuthDialog(false)
  }

  const switchToRegister = () => {
    setAuthMode("register")
  }

  const switchToLogin = () => {
    setAuthMode("login")
  }

  if (!user) {
    return (
      <>
        <Button
          variant="ghost"
          onClick={() => {
            setAuthMode("login")
            setShowAuthDialog(true)
          }}
        >
          <LogIn className="h-4 w-4 mr-2" />
          {t("common.login")}
        </Button>

        <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{authMode === "login" ? t("auth.loginTitle") : t("auth.registerTitle")}</DialogTitle>
            </DialogHeader>
            {authMode === "login" ? (
              <LoginForm onSuccess={handleAuthSuccess} onSwitchToRegister={switchToRegister} />
            ) : (
              <RegisterForm onSuccess={handleAuthSuccess} onSwitchToLogin={switchToLogin} />
            )}
          </DialogContent>
        </Dialog>
      </>
    )
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar_url || undefined} alt={user.username} />
              <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              <p className="font-medium">{user.username}</p>
              <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowProfileDialog(true)}>
            <User className="mr-2 h-4 w-4" />
            <span>{t("common.profile")}</span>
          </DropdownMenuItem>
          {user.is_admin && (
            <DropdownMenuItem asChild>
              <Link href="/admin">
                <Shield className="mr-2 h-4 w-4" />
                <span>{t("common.admin")}</span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>{t("common.logout")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("common.profile")}</DialogTitle>
          </DialogHeader>
          <ProfileForm user={user} onClose={() => setShowProfileDialog(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}
