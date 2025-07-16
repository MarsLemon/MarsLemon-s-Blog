-- 确保文件表有SHA1哈希字段
ALTER TABLE files ADD COLUMN IF NOT EXISTS file_hash VARCHAR(40);

-- 创建哈希索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_files_hash ON files(file_hash);

-- 为现有文件生成随机哈希（实际应用中应该重新计算）
UPDATE files SET file_hash = md5(random()::text) WHERE file_hash IS NULL;

-- 确保用户表支持用户名或邮箱登录
ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(50) UNIQUE;
UPDATE users SET username = split_part(email, '@', 1) WHERE username IS NULL;
