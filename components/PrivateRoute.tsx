'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    return typeof payload.exp === 'number' && payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!isTokenValid(token)) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      router.replace('/login');
    }
  }, [router]);

  if (typeof window !== 'undefined' && !isTokenValid(localStorage.getItem('token'))) {
    return null;
  }

  return <>{children}</>;
}
