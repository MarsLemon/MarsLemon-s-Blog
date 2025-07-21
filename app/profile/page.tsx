'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/user-context';
import { ProfileForm } from '@/components/auth/profile-form';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';

export default function ProfilePage() {
  const { user, loading: userLoading, refreshUser } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);
  const [passwordChangeError, setPasswordChangeError] = useState('');

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);
  const [twoFactorError, setTwoFactorError] = useState('');

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
    if (user) {
      // Assuming user object might have a two_factor_enabled field
      setTwoFactorEnabled(user.two_factor_enabled || false);
    }
  }, [user, userLoading, router]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeLoading(true);
    setPasswordChangeError('');

    if (newPassword !== confirmNewPassword) {
      setPasswordChangeError('新密码和确认密码不匹配。');
      setPasswordChangeLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setPasswordChangeError('新密码长度至少6位。');
      setPasswordChangeLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: '密码修改成功',
          description: '您的密码已成功更新。',
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        setPasswordChangeError(data.message || '密码修改失败。');
        toast({
          title: '密码修改失败',
          description: data.message || '请检查当前密码是否正确。',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('密码修改请求失败:', error);
      setPasswordChangeError('网络或服务器错误，请稍后再试。');
      toast({
        title: '错误',
        description: '网络或服务器错误，请稍后再试。',
        variant: 'destructive',
      });
    } finally {
      setPasswordChangeLoading(false);
    }
  };

  const handleTwoFactorToggle = async (checked: boolean) => {
    setTwoFactorLoading(true);
    setTwoFactorError('');
    // Simulate API call
    try {
      // In a real application, you would make an API call here
      // to enable/disable 2FA and potentially verify a code.
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setTwoFactorEnabled(checked);
      toast({
        title: '双重认证',
        description: `双重认证已${checked ? '启用' : '禁用'}。`,
      });
      // Refresh user context to reflect changes
      refreshUser();
    } catch (error) {
      setTwoFactorError('更新双重认证状态失败。');
      toast({
        title: '错误',
        description: '更新双重认证状态失败。',
        variant: 'destructive',
      });
    } finally {
      setTwoFactorLoading(false);
    }
  };

  const handleTwoFactorCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTwoFactorLoading(true);
    setTwoFactorError('');
    // Simulate API call for code verification
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (twoFactorCode === '123456') {
        // Example code
        toast({
          title: '验证成功',
          description: '双重认证代码已验证。',
        });
        setTwoFactorCode('');
      } else {
        setTwoFactorError('验证码不正确。');
        toast({
          title: '验证失败',
          description: '双重认证代码不正确。',
          variant: 'destructive',
        });
      }
    } catch (error) {
      setTwoFactorError('验证双重认证代码失败。');
      toast({
        title: '错误',
        description: '验证双重认证代码失败。',
        variant: 'destructive',
      });
    } finally {
      setTwoFactorLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>加载中...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Redirect handled by useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">个人设置</h1>

      <div className="grid gap-8 md:grid-cols-2">
        {/* 个人资料 */}
        <Card>
          <CardHeader>
            <CardTitle>个人资料</CardTitle>
            <CardDescription>更新您的账户信息和头像。</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm user={user} onUpdate={refreshUser} />
          </CardContent>
        </Card>

        {/* 更改密码 */}
        {/* <Card>
          <CardHeader>
            <CardTitle>更改密码</CardTitle>
            <CardDescription>确保您的账户使用长而随机的密码以保持安全。</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">当前密码</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">新密码</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-new-password">确认新密码</Label>
                <Input
                  id="confirm-new-password"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                />
              </div>
              {passwordChangeError && <p className="text-red-500 text-sm">{passwordChangeError}</p>}
              <Button type="submit" disabled={passwordChangeLoading}>
                {passwordChangeLoading ? "保存中..." : "保存密码"}
              </Button>
            </form>
          </CardContent>
        </Card> */}

        {/* 双重认证 */}
        <Card>
          <CardHeader>
            <CardTitle>双重认证 (2FA)</CardTitle>
            <CardDescription>为您的账户添加额外的安全层。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="two-factor-switch">启用双重认证</Label>
              <Switch
                id="two-factor-switch"
                checked={twoFactorEnabled}
                onCheckedChange={handleTwoFactorToggle}
                disabled={twoFactorLoading}
              />
            </div>
            {twoFactorLoading && (
              <p className="text-muted-foreground">更新中...</p>
            )}
            {twoFactorError && (
              <p className="text-red-500 text-sm">{twoFactorError}</p>
            )}

            {twoFactorEnabled && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  请输入您的认证器应用程序中的6位代码。
                </p>
                <form
                  onSubmit={handleTwoFactorCodeSubmit}
                  className="space-y-4"
                >
                  <InputOTP
                    maxLength={6}
                    pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                    value={twoFactorCode}
                    onChange={(value) => setTwoFactorCode(value)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  <Button type="submit" disabled={twoFactorLoading}>
                    {twoFactorLoading ? '验证中...' : '验证代码'}
                  </Button>
                </form>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
