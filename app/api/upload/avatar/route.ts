import { type NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { verifyToken, updateUserAvatar } from "@/lib/auth";
import { getFileHash } from "@/lib/file-hash";
import { neon } from "@neondatabase/serverless";

import { env } from "@/lib/env";
const sql = neon(env.DATABASE_URL!);

export async function POST(request: NextRequest) {
  try {
    console.log("开始处理头像上传请求");

    // 验证用户身份
    const user = await verifyToken(request);
    if (!user) {
      console.log("用户未授权");
      return NextResponse.json(
        { success: false, message: "未授权" },
        { status: 401 }
      );
    }

    console.log("用户验证成功:", user.username);

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      console.log("未找到文件");
      return NextResponse.json(
        { success: false, message: "未找到文件" },
        { status: 400 }
      );
    }

    console.log("文件信息:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    // 验证文件类型
    if (!file.type.startsWith("image/")) {
      console.log("文件类型不正确:", file.type);
      return NextResponse.json(
        { success: false, message: "只能上传图片文件" },
        { status: 400 }
      );
    }

    // 验证文件大小（限制为5MB）
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      console.log("文件大小超限:", file.size);
      return NextResponse.json(
        { success: false, message: "图片大小不能超过5MB" },
        { status: 400 }
      );
    }

    // 生成文件哈希
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileHash = getFileHash(fileBuffer);
    console.log("文件哈希:", fileHash);

    // 检查文件是否已存在
    const existingFiles = await sql`
      SELECT file_path FROM files WHERE file_hash = ${fileHash} LIMIT 1
    `;

    let fileUrl: string;
    if (existingFiles.length > 0) {
      fileUrl = existingFiles[0].file_path;
      console.log(`文件已存在，使用现有文件: ${fileUrl}`);
    } else {
      // 生成文件名
      const timestamp = Date.now();
      const fileExtension = file.name.split(".").pop() || "jpg";
      const filename = `avatars/${user.id}-${timestamp}.${fileExtension}`;

      console.log("开始上传到Vercel Blob:", filename);

      // 上传到 Vercel Blob
      const blob = await put(filename, file, {
        access: "public",
        contentType: file.type,
      });
      fileUrl = blob.url;

      console.log("Vercel Blob上传成功:", fileUrl);

      // 记录文件信息到数据库
      await sql`
        INSERT INTO files (filename, original_name, file_path, file_type, file_size, file_hash, folder, created_at)
        VALUES (${filename}, ${file.name}, ${fileUrl}, ${file.type}, ${file.size}, ${fileHash}, 'avatars', NOW())
      `;
      console.log("文件信息已保存到数据库");
    }

    // 更新用户头像URL
    console.log("更新用户头像URL:", fileUrl);
    const updatedUser = await updateUserAvatar(user.id, fileUrl);

    return NextResponse.json({
      success: true,
      message: "头像更新成功",
      avatarUrl: fileUrl,
      user: updatedUser,
    });
  } catch (error) {
    console.error("头像上传详细错误:", error);
    return NextResponse.json(
      {
        success: false,
        message: `服务器错误: ${
          error instanceof Error ? error.message : "未知错误"
        }`,
      },
      { status: 500 }
    );
  }
}
