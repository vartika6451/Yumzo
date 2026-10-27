'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '../store/useAuthStore';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    if (!user) {
      router.push('/login');
    } else if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.push('/home');
    }
  }, [user, allowedRoles, router, isClient]);

  if (!isClient) return null;
  if (!user) return null;
  if (allowedRoles && !allowedRoles.includes(user.role)) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
