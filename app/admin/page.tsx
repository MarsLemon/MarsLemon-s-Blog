import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { isAuthenticated, logoutAction } from "./auth-actions"
import { AdminDashboard } from "@/components/admin-dashboard"
import { LogOut } from "lucide-react"

export default async function AdminPage() {
  const authenticated = await isAuthenticated()

  if (!authenticated) {
    redirect("/admin/login")
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">博客管理</h1>
          <p className="text-muted-foreground mt-2">管理你的博客文章</p>
        </div>
        <form action={logoutAction}>
          <Button variant="outline" type="submit">
            <LogOut className="w-4 h-4 mr-2" />
            登出
          </Button>
        </form>
      </div>

      <AdminDashboard />
    </div>
  )
}
