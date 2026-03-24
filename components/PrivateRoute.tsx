'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  React.useEffect(() => {
    const isLoggedIn = Boolean(localStorage.getItem('token'));
    if (!isLoggedIn) {
      router.replace('/login');
    }
  }, [router]);

  if (typeof window !== 'undefined' && !localStorage.getItem('token')) {
    return null;
  }

  return <>{children}</>;
}
