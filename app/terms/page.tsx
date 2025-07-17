import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">服务条款</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>1. 接受条款</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              通过访问和使用本博客平台，您同意遵守本服务条款以及所有适用的法律法规。如果您不同意这些条款，请勿使用本平台。
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>2. 用户账户</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              您可能需要注册一个账户才能访问本平台的某些功能。您有责任维护您账户信息的机密性，并对您账户下发生的所有活动负责。
            </p>
            <p className="text-muted-foreground">您同意在注册时提供真实、准确、最新和完整的个人信息。</p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>3. 用户行为</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              您同意在使用本平台时遵守所有适用的法律法规，并且不从事以下任何活动：
            </p>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>
                发布、传输或以其他方式提供任何非法、有害、威胁、辱骂、骚扰、诽谤、淫秽、侵犯他人隐私或种族、民族或其他方面令人反感的内容；
              </li>
              <li>冒充任何个人或实体，或虚假陈述您与任何个人或实体的关系；</li>
              <li>
                上传、发布、电子邮件传输或以其他方式提供任何未经授权的广告、促销材料、垃圾邮件、连锁信、金字塔计划或任何其他形式的招揽；
              </li>
              <li>
                上传、发布、电子邮件传输或以其他方式提供任何包含病毒或其他计算机代码、文件或程序的内容，这些内容旨在中断、破坏或限制任何计算机软件或硬件或电信设备的功能；
              </li>
              <li>干扰或破坏本平台或连接到本平台的服务器或网络。</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>4. 知识产权</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              本平台上的所有内容，包括但不限于文本、图形、徽标、图像、音频剪辑、视频剪辑、数据编译和软件，均为本平台或其内容供应商的财产，并受版权法保护。
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>5. 免责声明</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              本平台按“原样”和“可用”的基础提供。我们不作任何明示或暗示的保证，包括但不限于适销性、特定用途适用性和不侵权的暗示保证。
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>6. 责任限制</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              在任何情况下，我们均不对因使用或无法使用本平台而引起的任何直接、间接、附带、特殊或后果性损害负责，即使我们已被告知此类损害的可能性。
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. 政策变更</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              我们保留随时修改本服务条款的权利。所有修改将在发布到本平台后立即生效。您继续使用本平台即表示您接受这些修改。
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
