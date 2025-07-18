-- 创建访问统计表
CREATE TABLE IF NOT EXISTS post_analytics (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT,
  is_logged_in BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_post_analytics_post_id ON post_analytics(post_id);
CREATE INDEX IF NOT EXISTS idx_post_analytics_created_at ON post_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_post_analytics_user_id ON post_analytics(user_id);

-- 为posts表添加view_count字段
ALTER TABLE posts ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
