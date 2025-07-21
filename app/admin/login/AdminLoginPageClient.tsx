'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export default function AdminLoginPageClient() {
  const [identifier, setIdentifier] = useState(''); // 可以是用户名或邮箱
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: '登录成功',
          description: '您已成功登录管理后台。',
        });
        router.push('/admin'); // 登录成功后跳转到管理后台首页
      } else {
        toast({
          title: '登录失败',
          description: data.message || '用户名或密码不正确。',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('登录请求失败:', error);
      toast({
        title: '错误',
        description: '网络或服务器错误，请稍后再试。',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-gray-100 px-4 dark:bg-gray-950">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">管理员登录</CardTitle>
          <CardDescription>
            输入您的用户名/邮箱和密码以访问管理后台。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier">用户名或邮箱</Label>
              <Input
                id="identifier"
                type="text"
                placeholder="请输入用户名或邮箱"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                placeholder="请输入密码"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '登录中...' : '登录'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          <p>
            没有账户？
            <a className="underline" href="/admin/register">
              注册
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
