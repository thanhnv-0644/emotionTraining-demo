'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { api, setTokens, clearTokens } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: string;
  xp: number;
  status: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    try {
      const data = await api.get<User>('/api/users/me');
      setUser(data);
    } catch {
      clearTokens();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      refreshUser().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const data = await api.post<{ accessToken: string; refreshToken: string; user: User }>(
      '/api/auth/login',
      { email, password }
    );
    setTokens(data.accessToken, data.refreshToken);
    setUser(data.user);
    if (data.user.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/user/dashboard');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await api.post<{ accessToken: string; refreshToken: string; user: User }>(
      '/api/auth/register',
      { name, email, password }
    );
    setTokens(data.accessToken, data.refreshToken);
    setUser(data.user);
    router.push('/user/dashboard');
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      await api.post('/api/auth/logout', { refreshToken });
    } catch {
      // ignore
    }
    clearTokens();
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
