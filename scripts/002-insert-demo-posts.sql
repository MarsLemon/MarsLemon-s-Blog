-- 检查是否存在名为 'Mars' 的用户，如果不存在则跳过插入文章
DO $$
DECLARE
    mars_user_id INT;
BEGIN
    SELECT id INTO mars_user_id FROM users WHERE username = 'Mars';

    IF mars_user_id IS NOT NULL THEN
        -- 插入示例文章
        INSERT INTO posts (title, content, excerpt, slug, cover_image, author_id, published, is_featured, is_pinned, view_count) VALUES
        ('我的第一篇博客文章', 
         '这是我的第一篇博客文章内容。它涵盖了Next.js、React和Tailwind CSS的基础知识。

## Next.js

Next.js是一个基于React的Web框架，它支持服务器端渲染（SSR）、静态站点生成（SSG）和客户端渲染（CSR）。

### 主要特性

*   **文件系统路由**: 自动根据文件结构生成路由。
*   **API 路由**: 轻松创建后端API端点。
*   **图像优化**: 内置的`next/image`组件可以自动优化图像。

## React

React是一个用于构建用户界面的JavaScript库。

### 核心概念

*   **组件**: 可复用的UI构建块。
*   **JSX**: 一种JavaScript的语法扩展，用于描述UI。
*   **状态与Props**: 管理组件数据流。

## Tailwind CSS

Tailwind CSS是一个实用程序优先的CSS框架，用于快速构建自定义设计。

### 优点

*   **快速开发**: 无需编写自定义CSS。
*   **高度可定制**: 可以轻松定制设计系统。
*   **响应式设计**: 内置的响应式工具类。

希望你喜欢这篇介绍！', 
         '这是我的第一篇博客文章内容。它涵盖了Next.js、React和Tailwind CSS的基础知识。', 
         'my-first-blog-post', 
         'https://assets.vercel.com/image/upload/v1708966906/nextjs-blog-template/nextjs-tailwind-blog.jpg', 
         mars_user_id, 
         TRUE, 
         TRUE, 
         TRUE, 
         120);

        INSERT INTO posts (title, content, excerpt, slug, cover_image, author_id, published, is_featured, is_pinned, view_count) VALUES
        ('学习JavaScript的旅程', 
         'JavaScript是Web开发的核心技术之一。本文将分享我学习JavaScript的旅程和一些学习技巧。

## 基础知识

从变量、数据类型到函数和对象，JavaScript的基础是构建复杂应用的关键。

### 变量声明

\`\`\`javascript
let name = "Alice";
const age = 30;
var city = "New York"; // 不推荐使用 var
\`\`\`

## 进阶概念

闭包、原型链、异步编程（Promise, Async/Await）是JavaScript中更高级但非常重要的概念。

## 框架与库

学习React、Vue或Angular等框架可以帮助你更高效地构建复杂的单页应用。', 
         'JavaScript是Web开发的核心技术之一。本文将分享我学习JavaScript的旅程和一些学习技巧。', 
         'learning-javascript-journey', 
         'https://assets.vercel.com/image/upload/v1708966906/nextjs-blog-template/javascript-learning.jpg', 
         mars_user_id, 
         TRUE, 
         FALSE, 
         FALSE, 
         85);

        INSERT INTO posts (title, content, excerpt, slug, cover_image, author_id, published, is_featured, is_pinned, view_count) VALUES
        ('使用PostgreSQL进行数据管理', 
         'PostgreSQL是一个功能强大的开源关系型数据库系统。本文将介绍如何在项目中使用PostgreSQL。

## 安装与配置

在不同的操作系统上安装PostgreSQL的步骤。

### Docker安装示例

\`\`\`bash
docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres
\`\`\`

## 基本SQL操作

创建表、插入数据、查询数据和更新/删除数据。

\`\`\`sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

INSERT INTO products (name, price) VALUES (''Laptop'', 1200.00);
SELECT * FROM products;
\`\`\`

## 进阶特性

索引、视图、存储过程和事务管理。', 
         'PostgreSQL是一个功能强大的开源关系型数据库系统。本文将介绍如何在项目中使用PostgreSQL。', 
         'data-management-with-postgresql', 
         'https://assets.vercel.com/image/upload/v1708966906/nextjs-blog-template/postgresql-data.jpg', 
         mars_user_id, 
         TRUE, 
         FALSE, 
         FALSE, 
         60);

        INSERT INTO posts (title, content, excerpt, slug, cover_image, author_id, published, is_featured, is_pinned, view_count) VALUES
        ('Web性能优化技巧', 
         '提升Web应用性能是用户体验的关键。本文将探讨一些实用的性能优化技巧。

## 图像优化

压缩图像、使用适当的格式（如WebP）和响应式图像。

## 代码分割

使用Webpack或Next.js等工具进行代码分割，按需加载JavaScript。

## 缓存策略

利用浏览器缓存和CDN来加速资源加载。', 
         '提升Web应用性能是用户体验的关键。本文将探讨一些实用的性能优化技巧。', 
         'web-performance-optimization', 
         'https://assets.vercel.com/image/upload/v1708966906/nextjs-blog-template/web-performance.jpg', 
         mars_user_id, 
         TRUE, 
         FALSE, 
         FALSE, 
         95);

        INSERT INTO posts (title, content, excerpt, slug, cover_image, author_id, published, is_featured, is_pinned, view_count) VALUES
        ('理解OAuth 2.0和JWT', 
         'OAuth 2.0和JWT（JSON Web Tokens）是现代认证和授权的基石。

## OAuth 2.0

OAuth 2.0是一个授权框架，允许第三方应用在不获取用户凭据的情况下访问用户资源。

### 授权流程

1.  **授权码**: 最常用的流程，安全且灵活。
2.  **隐式**: 适用于单页应用，但安全性较低。
3.  **客户端凭据**: 适用于机器对机器的认证。

## JWT

JWT是一种紧凑且自包含的方式，用于在各方之间安全地传输信息。

### 结构

*   **Header**: 包含令牌类型和签名算法。
*   **Payload**: 包含声明（claims），如用户ID、角色等。
*   **Signature**: 用于验证令牌的完整性。', 
         'OAuth 2.0和JWT（JSON Web Tokens）是现代认证和授权的基石。', 
         'understanding-oauth2-jwt', 
         'https://assets.vercel.com/image/upload/v1708966906/nextjs-blog-template/oauth-jwt.jpg', 
         mars_user_id, 
         TRUE, 
         FALSE, 
         FALSE, 
         70);
    END IF;
END $$;
