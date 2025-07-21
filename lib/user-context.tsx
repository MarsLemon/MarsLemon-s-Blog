'use client';

import type React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

export interface User {
  id: number;
  username: string;
  email: string;
  avatar_url?: string | null;
  is_admin: boolean;
  is_verified: boolean;
  created_at?: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  updateAvatar: (file: File) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
        cache: 'no-store',
      });

      if (response.ok) {
        const data = await response.json();
        console.log('用户数据:', data); // 调试日志
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  const updateAvatar = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload/avatar', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    const data = await response.json();

    if (response.ok) {
      // 更新用户头像URL
      if (user) {
        setUser({ ...user, avatar_url: data.avatarUrl });
      }
    } else {
      throw new Error(data.message || '头像上传失败');
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, loading, refreshUser, logout, updateAvatar }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
