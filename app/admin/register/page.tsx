"use client"
import RegisterForm from "@/components/auth/register-form"

export default function AdminRegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12 dark:bg-gray-950">
      <RegisterForm />
    </div>
  )
}
