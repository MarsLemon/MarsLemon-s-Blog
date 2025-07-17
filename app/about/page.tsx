import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Github, Mail, Globe } from "lucide-react"

export default function AboutPage() {
  const technologies = ["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL", "Vercel", "Git"]

  const features = [
    {
      title: "现代化技术栈",
      description: "使用最新的Web技术构建，确保最佳的性能和用户体验",
    },
    {
      title: "响应式设计",
      description: "完美适配各种设备，无论是桌面端还是移动端",
    },
    {
      title: "SEO优化",
      description: "针对搜索引擎优化，让您的内容更容易被发现",
    },
    {
      title: "安全可靠",
      description: "采用现代安全实践，保护用户数据和隐私",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* 页面头部 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">关于我们</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            一个专注于现代Web开发技术的博客平台，分享最新的技术趋势和开发经验
          </p>
        </div>

        {/* 项目介绍 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>项目简介</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              这是一个基于Next.js构建的现代化博客平台，旨在为开发者提供一个分享技术文章、交流开发经验的平台。
              我们专注于前端技术、后端开发、DevOps等领域的内容分享。
            </p>
            <p className="text-muted-foreground">
              平台支持用户注册、文章发布、评论互动等功能，采用响应式设计，确保在各种设备上都有良好的用户体验。
            </p>
          </CardContent>
        </Card>

        {/* 技术栈 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>技术栈</CardTitle>
            <CardDescription>本项目使用的主要技术和工具</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 特性介绍 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">平台特性</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 联系信息 */}
        <Card>
          <CardHeader>
            <CardTitle>联系我们</CardTitle>
            <CardDescription>如果您有任何问题或建议，欢迎联系我们</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <span>support@example.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Github className="h-5 w-5 text-muted-foreground" />
                <span>github.com/example/blog</span>
              </div>
              <div className="flex items-center space-x-3">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <span>www.example.com</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
