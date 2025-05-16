import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CalendarIcon, ArrowLeft } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// This would typically come from a CMS or API
const getBlogPosts = () => {
  return [
    {
      id: "1",
      title: "Getting Started with Next.js 15",
      content: `
        <p>Next.js 15 introduces several exciting features that make building web applications even more efficient and powerful. In this post, we'll explore the key highlights and how you can leverage them in your projects.</p>
        
        <h2>Server Components</h2>
        <p>React Server Components are a revolutionary new way to build React applications. They allow you to render components on the server, reducing the JavaScript sent to the client and improving performance.</p>
        
        <p>With Server Components, you can:</p>
        <ul>
          <li>Access backend resources directly</li>
          <li>Keep sensitive data and logic on the server</li>
          <li>Reduce bundle size and improve loading performance</li>
        </ul>
        
        <h2>Improved Routing</h2>
        <p>The App Router in Next.js 15 builds on the foundation laid in previous versions, offering more intuitive and powerful routing capabilities. The file-system based router makes it easy to create complex routing patterns with minimal configuration.</p>
        
        <h2>Enhanced Data Fetching</h2>
        <p>Next.js 15 introduces new patterns for data fetching that work seamlessly with Server Components. You can now fetch data directly in your components without needing to use API routes or client-side fetching libraries.</p>
        
        <pre><code>// Example of data fetching in a Server Component
async function BlogPosts() {
  const posts = await getPosts();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}</code></pre>
        
        <h2>Conclusion</h2>
        <p>Next.js 15 represents a significant step forward in the evolution of the framework. By embracing Server Components and enhancing the routing and data fetching capabilities, it provides developers with powerful tools to build fast, scalable, and maintainable web applications.</p>
      `,
      date: "May 15, 2025",
      author: {
        name: "Sarah Johnson",
        avatar: "/background1.png?height=40&width=40",
        bio: "Frontend Developer specializing in React and Next.js",
      },
      coverImage: "/background1.png?height=600&width=1200",
      slug: "getting-started-with-nextjs-15",
    },
    {
      id: "2",
      title: "Building Accessible Web Applications",
      content: `
        <p>Accessibility is a crucial aspect of web development that ensures everyone, including people with disabilities, can use your website. In this post, we'll explore best practices for creating inclusive web experiences.</p>
        
        <h2>Why Accessibility Matters</h2>
        <p>Web accessibility is not just about compliance with regulations; it's about creating inclusive experiences that everyone can use. By building accessible websites, you're expanding your audience and demonstrating social responsibility.</p>
        
        <h2>Key Accessibility Principles</h2>
        <p>When building accessible web applications, keep these principles in mind:</p>
        
        <h3>1. Semantic HTML</h3>
        <p>Use HTML elements according to their intended purpose. For example, use heading tags (h1-h6) for headings, button elements for buttons, and anchor tags for links.</p>
        
        <h3>2. Keyboard Navigation</h3>
        <p>Ensure all interactive elements are accessible via keyboard. Users should be able to navigate your site using only the keyboard.</p>
        
        <h3>3. ARIA Attributes</h3>
        <p>Use ARIA (Accessible Rich Internet Applications) attributes when necessary to provide additional context to screen readers.</p>
        
        <h3>4. Color Contrast</h3>
        <p>Ensure sufficient color contrast between text and background to make content readable for users with visual impairments.</p>
        
        <h2>Testing for Accessibility</h2>
        <p>Regular testing is essential to ensure your web application remains accessible. Use tools like:</p>
        <ul>
          <li>Lighthouse</li>
          <li>WAVE</li>
          <li>axe</li>
          <li>Screen readers (NVDA, VoiceOver)</li>
        </ul>
        
        <h2>Conclusion</h2>
        <p>Building accessible web applications is not just a nice-to-have feature; it's a necessity. By following best practices and regularly testing your applications, you can create inclusive experiences that everyone can enjoy.</p>
      `,
      date: "May 10, 2025",
      author: {
        name: "Alex Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        bio: "Accessibility advocate and frontend developer",
      },
      coverImage: "/placeholder.svg?height=600&width=1200",
      slug: "building-accessible-web-applications",
    },
  ]
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const posts = getBlogPosts()
  const post = posts.find((post) => post.slug === params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to home
      </Link>

      <article className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarIcon className="mr-1 h-3 w-3" />
              {post.date}
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">{post.title}</h1>
          <div className="flex items-center gap-3 mb-8">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{post.author.name}</div>
              <div className="text-sm text-muted-foreground">{post.author.bio}</div>
            </div>
          </div>
        </div>

        <div className="relative h-[400px] w-full mb-8">
          <Image
            src={post.coverImage || "/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>

        <div
          className="prose prose-gray dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="border-t mt-12 pt-8">
          <h3 className="text-lg font-bold mb-4">Share this post</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Twitter
            </Button>
            <Button variant="outline" size="sm">
              Facebook
            </Button>
            <Button variant="outline" size="sm">
              LinkedIn
            </Button>
          </div>
        </div>
      </article>
    </div>
  )
}
