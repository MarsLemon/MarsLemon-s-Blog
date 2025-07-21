import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

import { env } from '@/lib/env';
const sql = neon(env.DATABASE_URL!);

export async function GET() {
  try {
    const username = 'Mars';
    const email = 'mars@example.com';
    const password = 'Mars9807130015'; // 默认密码

    // 检查管理员用户是否已存在
    const [existingUser] = await sql`
      SELECT id FROM users WHERE username = ${username} OR email = ${email} LIMIT 1
    `;

    if (existingUser) {
      return NextResponse.json(
        { message: '管理员账户已存在' },
        { status: 200 }
      );
    }

    // 哈希密码
    const passwordHash = await bcrypt.hash(password, 10);

    // 创建管理员用户
    await sql`
      INSERT INTO users (username, email, password_hash, is_admin, is_verified)
      VALUES (${username}, ${email}, ${passwordHash}, TRUE, TRUE)
    `;

    return NextResponse.json(
      { message: '管理员账户初始化成功' },
      { status: 201 }
    );
  } catch (error) {
    console.error('初始化管理员账户失败:', error);
    return NextResponse.json(
      { message: '服务器错误，初始化失败' },
      { status: 500 }
    );
  }
}
