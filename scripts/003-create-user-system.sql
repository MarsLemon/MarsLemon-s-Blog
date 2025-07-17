-- This script is for creating the user system.
-- The actual user creation is handled in app/api/init/route.ts
-- and app/api/auth/register/route.ts

-- 删除旧的admin表
DROP TABLE IF EXISTS admin;

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    is_admin BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建会话表
CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入默认管理员账户
INSERT INTO users (username, email, password_hash, is_admin, is_verified, avatar_url) 
VALUES (
    'Mars', 
    '1428485959@qq.com', 
    '$2a$12$8K1p/a0dclxKxYqmhQhXUeL4f/Aq2qVVdw2E8Aq2qVVdw2E8Aq2qVV', -- Mars9807130015
    true, 
    true,
    '/placeholder.png?height=40&width=40'
) ON CONFLICT (username) DO NOTHING;

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
