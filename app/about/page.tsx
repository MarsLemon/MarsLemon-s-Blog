import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">关于我们</h1>
          <p className="text-xl text-muted-foreground">欢迎来到我们的技术博客，这里分享最新的开发经验和技术见解</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>我们的使命</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                致力于分享高质量的技术内容，帮助开发者提升技能，推动技术社区的发展。
                我们相信知识分享的力量，通过博客文章、教程和经验分享， 为广大开发者提供有价值的学习资源。
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>技术栈</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Next.js</Badge>
                <Badge variant="secondary">React</Badge>
                <Badge variant="secondary">TypeScript</Badge>
                <Badge variant="secondary">Tailwind CSS</Badge>
                <Badge variant="secondary">PostgreSQL</Badge>
                <Badge variant="secondary">Vercel</Badge>
                <Badge variant="secondary">Node.js</Badge>
                <Badge variant="secondary">Prisma</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle>团队成员</CardTitle>
            <CardDescription>认识我们的核心团队</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src="/placeholder-user.jpg" alt="Mars" />
                  <AvatarFallback>M</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold">Mars</h3>
                <p className="text-sm text-muted-foreground">创始人 & 全栈开发</p>
                <p className="text-xs text-muted-foreground mt-2">专注于现代Web开发技术，热爱开源项目</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>联系我们</CardTitle>
            <CardDescription>有任何问题或建议，欢迎与我们联系</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">邮箱</h4>
                <p className="text-muted-foreground">mars@example.com</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">GitHub</h4>
                <p className="text-muted-foreground">github.com/marslemon</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
