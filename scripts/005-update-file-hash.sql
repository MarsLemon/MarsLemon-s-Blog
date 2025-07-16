-- 添加文件哈希字段到files表
ALTER TABLE files ADD COLUMN IF NOT EXISTS file_hash VARCHAR(40);

-- 为file_hash字段创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_files_hash ON files(file_hash);

-- 更新现有文件的哈希值（如果需要的话）
-- 注意：这个操作可能需要重新计算现有文件的哈希值
-- UPDATE files SET file_hash = 'placeholder' WHERE file_hash IS NULL;
