-- 插入演示文章数据
INSERT INTO posts (title, slug, excerpt, content, cover_image, is_featured, is_pinned, created_at) VALUES 
(
    'Getting Started with Next.js 15',
    'getting-started-with-nextjs-15',
    'Learn how to build modern web applications with the latest version of Next.js',
    '# Getting Started with Next.js 15

Next.js 15 introduces several exciting features that make building web applications even more efficient and powerful. In this post, we''ll explore the key highlights and how you can leverage them in your projects.

## Server Components

React Server Components are a revolutionary new way to build React applications. They allow you to render components on the server, reducing the JavaScript sent to the client and improving performance.

With Server Components, you can:
- Access backend resources directly
- Keep sensitive data and logic on the server
- Reduce bundle size and improve loading performance

## Improved Routing

The App Router in Next.js 15 builds on the foundation laid in previous versions, offering more intuitive and powerful routing capabilities. The file-system based router makes it easy to create complex routing patterns with minimal configuration.

## Enhanced Data Fetching

Next.js 15 introduces new patterns for data fetching that work seamlessly with Server Components. You can now fetch data directly in your components without needing to use API routes or client-side fetching libraries.

```javascript
// Example of data fetching in a Server Component
async function BlogPosts() {
  const posts = await getPosts();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
