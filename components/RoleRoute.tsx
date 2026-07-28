'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { hasRequiredRole } from '@/lib/roles';

interface RoleRouteProps {
  children: React.ReactNode;
  role: string;
}

export default function RoleRoute({ children, role }: RoleRouteProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    if (!token || !hasRequiredRole(userRole, role)) {
      router.replace('/');
    } else {
      setAuthorized(true);
    }
  }, [router, role]);

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}
