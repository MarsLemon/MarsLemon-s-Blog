export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-4">404 | 页面不存在</h2>
      <a href="/" className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition">
        返回首页
      </a>
    </div>
  )
}
