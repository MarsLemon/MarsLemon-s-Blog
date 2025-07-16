import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">页面未找到</h2>
        <p className="text-gray-600 mb-8">抱歉，您访问的页面不存在。</p>
        <div className="space-x-4">
          <Button asChild>
            <Link href="/">返回首页</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/blog">查看博客</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
