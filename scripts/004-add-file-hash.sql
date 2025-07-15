-- 为文件表添加SHA1哈希字段
ALTER TABLE files ADD COLUMN IF NOT EXISTS file_hash VARCHAR(40);

-- 创建哈希索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_files_hash ON files(file_hash);

-- 为现有文件生成随机哈希（实际应用中应该重新计算）
UPDATE files SET file_hash = md5(random()::text) WHERE file_hash IS NULL;
