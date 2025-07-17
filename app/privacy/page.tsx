import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">隐私政策</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>1. 收集的信息</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              我们可能会收集您在使用本博客平台时提供给我们的个人信息，例如您的姓名、电子邮件地址、用户名和密码。
              此外，我们还会自动收集某些非个人信息，包括您的IP地址、浏览器类型、操作系统、访问时间以及您访问的页面。
            </p>
            <p className="text-muted-foreground">
              对于文章的访问，我们会记录文章ID、用户ID（如果登录）、IP地址和User-Agent，用于统计文章阅读量和分析用户行为。
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>2. 信息的使用</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">我们使用收集到的信息来：</p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>提供、运营和维护我们的博客平台；</li>
              <li>改进、个性化和扩展我们的博客平台；</li>
              <li>理解和分析您如何使用我们的博客平台；</li>
              <li>开发新的产品、服务、功能和特性；</li>
              <li>与您沟通，包括客户服务、提供更新和其他信息；</li>
              <li>发送电子邮件；</li>
              <li>查找和预防欺诈。</li>
            </ul>
            <p className="text-muted-foreground">
              文章访问统计数据用于分析文章受欢迎程度和优化内容推荐，不会用于识别个人身份。
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>3. 信息共享</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              我们不会将您的个人身份信息出售、交易或出租给第三方。
              我们可能会与受信任的第三方服务提供商共享信息，这些服务提供商协助我们运营网站、开展业务或为您提供服务，但前提是这些方同意对这些信息保密。
            </p>
            <p className="text-muted-foreground">
              我们也可能在法律要求或为了保护我们的权利、财产或安全时披露您的信息。
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>4. 数据安全</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              我们采取适当的数据收集、存储和处理实践以及安全措施，以防止未经授权的访问、更改、披露或销毁您的个人信息、用户名、密码、交易信息和存储在我们网站上的数据。
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>5. 您的权利</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              您有权访问、更正或删除我们持有的您的个人信息。如果您希望行使这些权利，请通过本政策末尾提供的联系方式与我们联系。
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>6. 政策变更</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              我们保留随时更新本隐私政策的权利。当我们这样做时，我们将在本页顶部修订更新日期。我们鼓励用户经常查看此页面，了解我们如何帮助保护我们收集的个人信息。您承认并同意，您有责任定期审查本隐私政策并了解修改。
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. 联系我们</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">如果您对本隐私政策有任何疑问，请通过以下方式联系我们：</p>
            <p className="text-muted-foreground mt-2">电子邮件: support@example.com</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
