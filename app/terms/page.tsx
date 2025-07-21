export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">服务条款</h1>

        <div className="prose prose-gray max-w-none">
          <h2 className="text-2xl font-semibold mb-4">1. 服务条款的接受</h2>
          <p className="mb-4">
            欢迎使用我们的博客平台。通过访问和使用本网站，您同意遵守以下服务条款。如果您不同意这些条款，请不要使用本服务。
          </p>

          <h2 className="text-2xl font-semibold mb-4">2. 服务描述</h2>
          <p className="mb-4">
            本网站是一个技术博客平台，提供技术文章阅读、用户注册、评论等功能。我们保留随时修改或终止服务的权利。
          </p>

          <h2 className="text-2xl font-semibold mb-4">3. 用户责任</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>用户必须提供真实、准确的注册信息</li>
            <li>
              用户不得发布违法、有害、威胁、辱骂、骚扰、诽谤、粗俗、淫秽或其他不当内容
            </li>
            <li>用户不得进行任何可能损害网站安全的行为</li>
            <li>用户对其账户的所有活动负责</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">4. 知识产权</h2>
          <p className="mb-4">
            本网站的所有内容，包括但不限于文字、图片、音频、视频、软件、程序、版面设计等均受知识产权法保护。未经授权，不得复制、传播或用于商业目的。
          </p>

          <h2 className="text-2xl font-semibold mb-4">5. 免责声明</h2>
          <p className="mb-4">
            本网站按"现状"提供服务，不对服务的准确性、完整性、可靠性做任何保证。用户使用本服务的风险由用户自行承担。
          </p>

          <h2 className="text-2xl font-semibold mb-4">6. 条款修改</h2>
          <p className="mb-4">
            我们保留随时修改这些服务条款的权利。修改后的条款将在网站上公布，继续使用服务即表示接受修改后的条款。
          </p>

          <h2 className="text-2xl font-semibold mb-4">7. 联系我们</h2>
          <p className="mb-4">
            如果您对这些服务条款有任何疑问，请通过邮箱联系我们：support@example.com
          </p>

          <p className="text-sm text-muted-foreground mt-8">
            最后更新时间：{new Date().toLocaleDateString('zh-CN')}
          </p>
        </div>
      </div>
    </div>
  );
}
