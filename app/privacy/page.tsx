export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">隐私政策</h1>

        <div className="prose prose-gray max-w-none">
          <h2 className="text-2xl font-semibold mb-4">1. 信息收集</h2>
          <p className="mb-4">我们收集以下类型的信息：</p>
          <ul className="list-disc pl-6 mb-4">
            <li>注册信息：用户名、邮箱地址等</li>
            <li>使用信息：访问日志、IP地址、浏览器信息等</li>
            <li>用户生成内容：评论、文章等</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">2. 信息使用</h2>
          <p className="mb-4">我们使用收集的信息用于：</p>
          <ul className="list-disc pl-6 mb-4">
            <li>提供和改进我们的服务</li>
            <li>与用户沟通</li>
            <li>确保网站安全</li>
            <li>分析网站使用情况</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">3. 信息共享</h2>
          <p className="mb-4">
            我们不会向第三方出售、交易或转让您的个人信息，除非：
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>获得您的明确同意</li>
            <li>法律要求</li>
            <li>保护我们的权利和安全</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">4. 数据安全</h2>
          <p className="mb-4">
            我们采取适当的安全措施来保护您的个人信息，包括：
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>数据加密</li>
            <li>访问控制</li>
            <li>定期安全审计</li>
            <li>员工培训</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">5. Cookie使用</h2>
          <p className="mb-4">我们使用Cookie来改善用户体验，包括：</p>
          <ul className="list-disc pl-6 mb-4">
            <li>记住登录状态</li>
            <li>保存用户偏好</li>
            <li>分析网站使用情况</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">6. 用户权利</h2>
          <p className="mb-4">您有权：</p>
          <ul className="list-disc pl-6 mb-4">
            <li>访问您的个人信息</li>
            <li>更正不准确的信息</li>
            <li>删除您的账户和数据</li>
            <li>限制信息处理</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">7. 政策更新</h2>
          <p className="mb-4">
            我们可能会不时更新此隐私政策。重大变更将通过网站通知或邮件通知用户。
          </p>

          <h2 className="text-2xl font-semibold mb-4">8. 联系我们</h2>
          <p className="mb-4">
            如果您对此隐私政策有任何疑问，请联系我们：privacy@example.com
          </p>

          <p className="text-sm text-muted-foreground mt-8">
            最后更新时间：{new Date().toLocaleDateString('zh-CN')}
          </p>
        </div>
      </div>
    </div>
  );
}
