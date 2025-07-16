-- 添加 files 表用于存储文件信息，支持 SHA1 哈希去重
CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  size BIGINT NOT NULL,
  hash VARCHAR(40) UNIQUE NOT NULL, -- SHA1 哈希值，用于去重
  url TEXT NOT NULL, -- Vercel Blob URL
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 为 posts 表添加 cover_image 字段，用于存储文章封面图 URL
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS cover_image TEXT;

-- 为 users 表添加 avatar_url 字段，用于存储用户头像 URL
ALTER TABLE users
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 为 users 表添加 is_admin 字段，用于区分管理员
ALTER TABLE users
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- 为 users 表添加 is_verified 字段，用于用户验证状态
ALTER TABLE users
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;

-- 为 users 表添加 password_hash 字段，用于存储密码哈希
ALTER TABLE users
ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- 如果 users 表中没有 password_hash 字段，则添加并更新现有用户
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='password_hash') THEN
        ALTER TABLE users ADD COLUMN password_hash TEXT;
    END IF;
END $$;

-- 如果 users 表中没有 username 字段，则添加
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='username') THEN
        ALTER TABLE users ADD COLUMN username VARCHAR(255) UNIQUE;
    END IF;
END $$;

-- 如果 users 表中没有 email 字段，则添加
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='email') THEN
        ALTER TABLE users ADD COLUMN email VARCHAR(255) UNIQUE;
    END IF;
END $$;

-- 如果 users 表中没有 created_at 字段，则添加
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='created_at') THEN
        ALTER TABLE users ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;

-- 如果 users 表中没有 updated_at 字段，则添加
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='updated_at') THEN
        ALTER TABLE users ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;

-- 为 posts 表添加 author_name 和 author_avatar 字段
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS author_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS author_avatar TEXT;

-- 确保 posts 表的 published 字段存在且为布尔类型
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='posts' AND column_name='published') THEN
        ALTER TABLE posts ADD COLUMN published BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- 确保 posts 表的 is_featured 字段存在且为布尔类型
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='posts' AND column_name='is_featured') THEN
        ALTER TABLE posts ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- 确保 posts 表的 is_pinned 字段存在且为布尔类型
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='posts' AND column_name='is_pinned') THEN
        ALTER TABLE posts ADD COLUMN is_pinned BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- 添加索引到 files 表的 hash 列以加快查找速度
CREATE INDEX IF NOT EXISTS idx_files_hash ON files (hash);

-- 可选：如果需要在 posts 或 users 中存储文件 ID，可以添加类似以下的列：
-- ALTER TABLE posts ADD COLUMN cover_image_file_id UUID REFERENCES files(id);
-- ALTER TABLE users ADD COLUMN avatar_file_id UUID REFERENCES files(id);
